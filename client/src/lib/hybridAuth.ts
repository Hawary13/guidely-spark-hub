import { User } from "@shared/schema";
import { db } from "./firebase";
import { 
  collection, 
  doc, 
  getDoc, 
  setDoc, 
  updateDoc, 
  getDocs, 
  query, 
  where,
  serverTimestamp,
  Timestamp 
} from "firebase/firestore";

export interface AuthResult {
  success: boolean;
  error?: string;
  user?: User;
}

export class HybridAuthService {
  private static currentUser: User | null = null;
  private static authListeners: ((user: User | null) => void)[] = [];
  private static readonly USERS_COLLECTION = 'admin_users';

  // Simple password hashing
  private static hashPassword(password: string): string {
    return btoa(password + 'gsf-salt-2024');
  }

  private static verifyPassword(password: string, hash: string): boolean {
    return this.hashPassword(password) === hash;
  }

  // Convert Firestore timestamp to Date
  private static convertTimestamps(userData: any): User {
    return {
      ...userData,
      createdAt: userData.createdAt instanceof Timestamp ? userData.createdAt.toDate() : new Date(userData.createdAt),
      updatedAt: userData.updatedAt instanceof Timestamp ? userData.updatedAt.toDate() : new Date(userData.updatedAt),
      lastLogin: userData.lastLogin instanceof Timestamp ? userData.lastLogin.toDate() : userData.lastLogin ? new Date(userData.lastLogin) : undefined,
    };
  }

  // Get stored users from localStorage (fallback)
  private static getStoredUsers(): (User & { passwordHash: string })[] {
    const stored = localStorage.getItem('gsf_admin_users');
    if (!stored) return [];
    
    try {
      return JSON.parse(stored);
    } catch {
      return [];
    }
  }

  // Save users to localStorage (fallback)
  private static saveUsers(users: (User & { passwordHash: string })[]) {
    localStorage.setItem('gsf_admin_users', JSON.stringify(users));
  }

  // Save user to Firestore
  private static async saveUserToFirestore(user: User & { passwordHash: string }): Promise<void> {
    try {
      const userRef = doc(db, this.USERS_COLLECTION, user.id);
      const firestoreData = {
        ...user,
        createdAt: user.createdAt || serverTimestamp(),
        updatedAt: serverTimestamp(),
        lastLogin: user.lastLogin || null,
      };
      await setDoc(userRef, firestoreData);
    } catch (error) {
      console.warn('Failed to save to Firestore, using localStorage fallback:', error);
      throw error;
    }
  }

  // Get user from Firestore
  private static async getUserFromFirestore(email: string): Promise<(User & { passwordHash: string }) | null> {
    try {
      const usersRef = collection(db, this.USERS_COLLECTION);
      const q = query(usersRef, where("email", "==", email));
      const querySnapshot = await getDocs(q);
      
      if (querySnapshot.empty) return null;
      
      const userData = querySnapshot.docs[0].data();
      return this.convertTimestamps(userData) as User & { passwordHash: string };
    } catch (error) {
      console.warn('Failed to get from Firestore, using localStorage fallback:', error);
      return null;
    }
  }

  // Get all users from Firestore
  private static async getAllUsersFromFirestore(): Promise<User[]> {
    try {
      const usersRef = collection(db, this.USERS_COLLECTION);
      const querySnapshot = await getDocs(usersRef);
      
      return querySnapshot.docs.map(doc => {
        const userData = doc.data();
        const { passwordHash, ...user } = userData;
        return this.convertTimestamps(user);
      });
    } catch (error) {
      console.warn('Failed to get users from Firestore, using localStorage fallback:', error);
      return [];
    }
  }

  // Update user in Firestore
  private static async updateUserInFirestore(userId: string, updates: Partial<User>): Promise<void> {
    try {
      const userRef = doc(db, this.USERS_COLLECTION, userId);
      await updateDoc(userRef, {
        ...updates,
        updatedAt: serverTimestamp(),
      });
    } catch (error) {
      console.warn('Failed to update in Firestore:', error);
      throw error;
    }
  }

  // Sign in with email and password
  static async signIn(email: string, password: string): Promise<AuthResult> {
    try {
      // Try Firestore first
      let user = await this.getUserFromFirestore(email);
      
      // Fallback to localStorage
      if (!user) {
        const localUsers = this.getStoredUsers();
        user = localUsers.find(u => u.email === email) || null;
      }
      
      if (!user) {
        return { success: false, error: "No account found with this email address." };
      }

      if (!user.isActive) {
        return { success: false, error: "Account is disabled." };
      }

      if (!this.verifyPassword(password, user.passwordHash)) {
        return { success: false, error: "Incorrect password." };
      }

      // Update last login
      const updatedUser = {
        ...user,
        lastLogin: new Date(),
        updatedAt: new Date(),
      };

      // Try to update in Firestore
      try {
        await this.updateUserInFirestore(user.id, { lastLogin: updatedUser.lastLogin });
      } catch (error) {
        // Update localStorage as fallback
        const localUsers = this.getStoredUsers();
        const userIndex = localUsers.findIndex(u => u.id === user.id);
        if (userIndex !== -1) {
          localUsers[userIndex] = updatedUser;
          this.saveUsers(localUsers);
        }
      }

      const { passwordHash, ...userWithoutPassword } = updatedUser;
      this.currentUser = userWithoutPassword;
      this.notifyAuthListeners(userWithoutPassword);
      localStorage.setItem('gsf_current_admin', JSON.stringify(userWithoutPassword));
      
      return { success: true, user: userWithoutPassword };
    } catch (error: any) {
      console.error('Sign in error:', error);
      return { success: false, error: "Sign in failed. Please try again." };
    }
  }

  // Create new admin user
  static async createAdminUser(userData: {
    email: string;
    password: string;
    displayName: string;
    role: 'super_admin' | 'admin' | 'editor';
  }): Promise<AuthResult> {
    try {
      // Check if user exists in Firestore
      let existingUser = await this.getUserFromFirestore(userData.email);
      
      // Check localStorage as fallback
      if (!existingUser) {
        const localUsers = this.getStoredUsers();
        existingUser = localUsers.find(u => u.email === userData.email) || null;
      }

      if (existingUser) {
        return { success: false, error: "Account with this email already exists." };
      }

      const passwordHash = this.hashPassword(userData.password);
      const newUser = {
        id: `user-${Date.now()}`,
        email: userData.email,
        name: userData.displayName,
        displayName: userData.displayName,
        role: userData.role,
        permissions: this.getRolePermissions(userData.role),
        isActive: true,
        passwordHash,
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      // Try to save to Firestore
      try {
        await this.saveUserToFirestore(newUser);
      } catch (error) {
        console.warn('Firestore save failed, using localStorage:', error);
      }

      // Always save to localStorage as backup
      const localUsers = this.getStoredUsers();
      localUsers.push(newUser);
      this.saveUsers(localUsers);

      const { passwordHash: _, ...userResponse } = newUser;
      return { success: true, user: userResponse };
    } catch (error: any) {
      console.error('Create user error:', error);
      return { success: false, error: "Failed to create user." };
    }
  }

  // Sign out
  static async signOut(): Promise<AuthResult> {
    try {
      this.currentUser = null;
      localStorage.removeItem('gsf_current_admin');
      this.notifyAuthListeners(null);
      return { success: true };
    } catch (error: any) {
      return { success: false, error: error.message };
    }
  }

  // Reset password
  static async resetPassword(email: string): Promise<AuthResult> {
    try {
      // Try Firestore first
      let user = await this.getUserFromFirestore(email);
      let useFirestore = true;
      
      // Fallback to localStorage
      if (!user) {
        const localUsers = this.getStoredUsers();
        const userIndex = localUsers.findIndex(u => u.email === email);
        if (userIndex === -1) {
          return { success: false, error: "No account found with this email." };
        }
        user = localUsers[userIndex];
        useFirestore = false;
      }

      const tempPassword = Math.random().toString(36).slice(-8);
      const passwordHash = this.hashPassword(tempPassword);

      if (useFirestore) {
        try {
          await this.updateUserInFirestore(user.id, { updatedAt: new Date() });
          // Also update password in Firestore (you'd need to add this field)
          const userRef = doc(db, this.USERS_COLLECTION, user.id);
          await updateDoc(userRef, { passwordHash, updatedAt: serverTimestamp() });
        } catch (error) {
          useFirestore = false;
        }
      }

      if (!useFirestore) {
        const localUsers = this.getStoredUsers();
        const userIndex = localUsers.findIndex(u => u.email === email);
        if (userIndex !== -1) {
          localUsers[userIndex].passwordHash = passwordHash;
          localUsers[userIndex].updatedAt = new Date();
          this.saveUsers(localUsers);
        }
      }

      console.log(`Temporary password for ${email}: ${tempPassword}`);
      return { 
        success: true, 
        error: `Temporary password: ${tempPassword} (Check console - in production this would be emailed)` 
      };
    } catch (error: any) {
      return { success: false, error: "Failed to reset password." };
    }
  }

  // Update user role
  static async updateUserRole(uid: string, role: User['role']): Promise<AuthResult> {
    try {
      const permissions = this.getRolePermissions(role);
      
      // Try Firestore first
      try {
        await this.updateUserInFirestore(uid, { role, permissions });
      } catch (error) {
        console.warn('Firestore update failed, using localStorage:', error);
      }

      // Always update localStorage as backup
      const localUsers = this.getStoredUsers();
      const userIndex = localUsers.findIndex(u => u.id === uid);
      if (userIndex !== -1) {
        localUsers[userIndex].role = role;
        localUsers[userIndex].permissions = permissions;
        localUsers[userIndex].updatedAt = new Date();
        this.saveUsers(localUsers);
      }
      
      return { success: true };
    } catch (error: any) {
      return { success: false, error: "Failed to update user role." };
    }
  }

  // Get all admin users
  static async getAllAdminUsers(): Promise<User[]> {
    try {
      // Try Firestore first
      const firestoreUsers = await this.getAllUsersFromFirestore();
      if (firestoreUsers.length > 0) {
        return firestoreUsers;
      }

      // Fallback to localStorage
      const localUsers = this.getStoredUsers();
      return localUsers.map(({ passwordHash, ...user }) => user as User);
    } catch (error) {
      console.error('Error getting admin users:', error);
      // Final fallback to localStorage
      const localUsers = this.getStoredUsers();
      return localUsers.map(({ passwordHash, ...user }) => user as User);
    }
  }

  // Check permissions
  static hasPermission(user: User | null, permission: string): boolean {
    if (!user || !user.isActive) return false;
    if (user.role === 'super_admin' || user.permissions.includes('all')) return true;
    return user.permissions.includes(permission);
  }

  // Get role permissions
  static getRolePermissions(role: User['role']): string[] {
    switch (role) {
      case 'super_admin': return ['all'];
      case 'admin': return [
        'pages:read', 'pages:write', 'programs:read', 'programs:write',
        'events:read', 'events:write', 'submissions:read', 'team:read', 
        'team:write', 'partners:read', 'partners:write', 'statistics:read', 
        'statistics:write', 'news:read', 'news:write', 'success-stories:read', 
        'success-stories:write'
      ];
      case 'editor': return [
        'pages:read', 'pages:write', 'programs:read', 'events:read',
        'submissions:read', 'news:read', 'news:write'
      ];
      default: return [];
    }
  }

  // Auth state listener
  static onAuthStateChanged(callback: (user: User | null) => void): () => void {
    this.authListeners.push(callback);
    
    const currentUser = this.getCurrentUser();
    callback(currentUser);
    
    return () => {
      this.authListeners = this.authListeners.filter(listener => listener !== callback);
    };
  }

  // Get current user
  static getCurrentUser(): User | null {
    if (this.currentUser) return this.currentUser;
    
    const stored = localStorage.getItem('gsf_current_admin');
    if (stored) {
      try {
        this.currentUser = JSON.parse(stored);
        return this.currentUser;
      } catch (error) {
        localStorage.removeItem('gsf_current_admin');
      }
    }
    
    return null;
  }

  // Notify listeners
  private static notifyAuthListeners(user: User | null) {
    this.authListeners.forEach(listener => listener(user));
  }

  // Initialize default admin
  static async initializeDefaultAdmin(): Promise<AuthResult> {
    try {
      // Check both Firestore and localStorage
      let existingUser = await this.getUserFromFirestore('admin@gsf.org.eg');
      if (!existingUser) {
        const localUsers = this.getStoredUsers();
        existingUser = localUsers.find(u => u.email === 'admin@gsf.org.eg') || null;
      }

      if (existingUser) {
        return { success: true, error: "Admin user already exists" };
      }

      const result = await this.createAdminUser({
        email: 'admin@gsf.org.eg',
        password: 'admin123',
        displayName: 'GSF Administrator',
        role: 'super_admin'
      });

      if (result.success) {
        console.log('Default admin created: admin@gsf.org.eg / admin123');
      }

      return result;
    } catch (error: any) {
      return { success: false, error: error.message };
    }
  }

  // Test connection
  static async testConnection(): Promise<{ success: boolean; message: string }> {
    try {
      // Test Firestore connection
      const testDoc = doc(db, 'test', 'connection');
      await getDoc(testDoc);
      return {
        success: true,
        message: "Firestore connection successful with localStorage backup"
      };
    } catch (error) {
      return {
        success: true,
        message: "Using localStorage authentication (Firestore unavailable)"
      };
    }
  }
}