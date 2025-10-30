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

export class FirestoreAuthService {
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

  // Save user to Firestore
  private static async saveUserToFirestore(user: User & { passwordHash: string }): Promise<void> {
    const userRef = doc(db, this.USERS_COLLECTION, user.id);
    const firestoreData = {
      ...user,
      createdAt: user.createdAt || serverTimestamp(),
      updatedAt: serverTimestamp(),
      lastLogin: user.lastLogin || null,
    };
    await setDoc(userRef, firestoreData);
  }

  // Get user from Firestore
  private static async getUserFromFirestore(email: string): Promise<(User & { passwordHash: string }) | null> {
    try {
      console.log(`Searching for user with email: ${email}`);
      const usersRef = collection(db, this.USERS_COLLECTION);
      const q = query(usersRef, where("email", "==", email));
      
      console.log(`Querying collection: ${this.USERS_COLLECTION}`);
      const querySnapshot = await getDocs(q);
      
      console.log(`Query result - docs found: ${querySnapshot.docs.length}`);
      
      if (querySnapshot.empty) {
        console.log('No user found with this email');
        return null;
      }
      
      const userData = querySnapshot.docs[0].data();
      console.log('User found, converting timestamps...');
      return this.convertTimestamps(userData) as User & { passwordHash: string };
    } catch (error) {
      console.error('Error getting user from Firestore:', error);
      throw error;
    }
  }

  // Get all users from Firestore
  private static async getAllUsersFromFirestore(): Promise<User[]> {
    const usersRef = collection(db, this.USERS_COLLECTION);
    const querySnapshot = await getDocs(usersRef);
    
    return querySnapshot.docs.map(doc => {
      const userData = doc.data();
      const { passwordHash, ...user } = userData;
      return this.convertTimestamps(user);
    });
  }

  // Update user in Firestore
  private static async updateUserInFirestore(userId: string, updates: Partial<User>): Promise<void> {
    const userRef = doc(db, this.USERS_COLLECTION, userId);
    await updateDoc(userRef, {
      ...updates,
      updatedAt: serverTimestamp(),
    });
  }

  // Sign in with email and password
  static async signIn(email: string, password: string): Promise<AuthResult> {
    try {
      // First try Firestore
      try {
        const user = await this.getUserFromFirestore(email);
        
        if (user) {
          if (!user.isActive) {
            return { success: false, error: "Account is disabled." };
          }

          if (!this.verifyPassword(password, user.passwordHash)) {
            return { success: false, error: "Incorrect password." };
          }

          // Update last login
          try {
            await this.updateUserInFirestore(user.id, { lastLogin: new Date() });
          } catch (updateError) {
            console.warn('Could not update last login in Firestore:', updateError);
          }

          const { passwordHash, ...userWithoutPassword } = user;
          userWithoutPassword.lastLogin = new Date();
          
          this.currentUser = userWithoutPassword;
          this.notifyAuthListeners(userWithoutPassword);
          
          return { success: true, user: userWithoutPassword };
        }
      } catch (firestoreError) {
        console.warn('Firestore unavailable, trying fallback authentication:', firestoreError);
      }

      // Fallback to hardcoded admin for development
      if (email === 'admin@gsf.org.eg' && password === 'admin123') {
        const fallbackUser: User = {
          id: 'admin-fallback',
          email: 'admin@gsf.org.eg',
          name: 'GSF Administrator',
          displayName: 'GSF Administrator',
          role: 'super_admin',
          permissions: ['all'],
          isActive: true,
          createdAt: new Date(),
          updatedAt: new Date(),
          lastLogin: new Date()
        };
        
        this.currentUser = fallbackUser;
        this.notifyAuthListeners(fallbackUser);
        
        console.log('Fallback admin login successful');
        return { success: true, user: fallbackUser };
      }
      
      return { success: false, error: "No account found with this email address." };
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
      // Check if user exists
      const existingUser = await this.getUserFromFirestore(userData.email);
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

      await this.saveUserToFirestore(newUser);

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
      this.notifyAuthListeners(null);
      return { success: true };
    } catch (error: any) {
      return { success: false, error: error.message };
    }
  }

  // Reset password
  static async resetPassword(email: string): Promise<AuthResult> {
    try {
      const user = await this.getUserFromFirestore(email);
      if (!user) {
        return { success: false, error: "No account found with this email." };
      }

      const tempPassword = Math.random().toString(36).slice(-8);
      const passwordHash = this.hashPassword(tempPassword);

      const userRef = doc(db, this.USERS_COLLECTION, user.id);
      await updateDoc(userRef, { passwordHash, updatedAt: serverTimestamp() });

      console.log(`Temporary password for ${email}: ${tempPassword}`);
      return { 
        success: true, 
        error: `Temporary password: ${tempPassword} (Check console - in production this would be emailed)` 
      };
    } catch (error: any) {
      console.error('Reset password error:', error);
      return { success: false, error: "Failed to reset password." };
    }
  }

  // Update user role
  static async updateUserRole(uid: string, role: User['role']): Promise<AuthResult> {
    try {
      const permissions = this.getRolePermissions(role);
      await this.updateUserInFirestore(uid, { role, permissions });
      return { success: true };
    } catch (error: any) {
      console.error('Update user role error:', error);
      return { success: false, error: "Failed to update user role." };
    }
  }

  // Get all admin users
  static async getAllAdminUsers(): Promise<User[]> {
    try {
      return await this.getAllUsersFromFirestore();
    } catch (error) {
      console.error('Error getting admin users:', error);
      return [];
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

  // Get current user (only from memory, no persistence)
  static getCurrentUser(): User | null {
    return this.currentUser;
  }

  // Notify listeners
  private static notifyAuthListeners(user: User | null) {
    this.authListeners.forEach(listener => listener(user));
  }

  // Initialize default admin
  static async initializeDefaultAdmin(): Promise<AuthResult> {
    try {
      console.log('Checking for existing admin user...');
      const existingUser = await this.getUserFromFirestore('admin@gsf.org.eg');
      if (existingUser) {
        console.log('Admin user already exists');
        return { success: true, error: "Admin user already exists" };
      }

      console.log('Creating default admin user...');
      const result = await this.createAdminUser({
        email: 'admin@gsf.org.eg',
        password: 'admin123',
        displayName: 'GSF Administrator',
        role: 'super_admin'
      });

      if (result.success) {
        console.log('Default admin created successfully: admin@gsf.org.eg / admin123');
      } else {
        console.error('Failed to create default admin:', result.error);
      }

      return result;
    } catch (error: any) {
      console.error('Initialize admin error:', error);
      return { success: false, error: error.message };
    }
  }

  // Test connection
  static async testConnection(): Promise<{ success: boolean; message: string }> {
    try {
      const testDoc = doc(db, 'test', 'connection');
      await getDoc(testDoc);
      return {
        success: true,
        message: "Firestore connection successful"
      };
    } catch (error: any) {
      console.error('Connection test error:', error);
      return {
        success: false,
        message: `Firestore connection failed: ${error.message}`
      };
    }
  }
}