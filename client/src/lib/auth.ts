// Simple authentication service using Firestore only (bypassing Firebase Auth issues)
import { 
  doc, 
  getDoc, 
  setDoc, 
  updateDoc,
  collection,
  query,
  where,
  getDocs,
  addDoc
} from "firebase/firestore";
import { db } from "./firebase";
import { User, InsertUser } from "@shared/schema";

export interface AuthResult {
  success: boolean;
  error?: string;
  user?: User;
}

export class AuthService {
  private static currentUser: User | null = null;
  private static authListeners: ((user: User | null) => void)[] = [];

  // Simple password hashing
  private static hashPassword(password: string): string {
    return btoa(password + 'gsf-salt-2024');
  }

  private static verifyPassword(password: string, hash: string): boolean {
    return this.hashPassword(password) === hash;
  }

  // Sign in with email and password using Firestore
  static async signIn(email: string, password: string): Promise<AuthResult> {
    try {
      const q = query(collection(db, 'admin_users'), where('email', '==', email));
      const querySnapshot = await getDocs(q);
      
      if (querySnapshot.empty) {
        return { success: false, error: "No account found with this email address." };
      }

      const userDoc = querySnapshot.docs[0];
      const userData = userDoc.data() as User & { passwordHash: string };
      
      if (!userData.isActive) {
        return { success: false, error: "Account is disabled." };
      }

      if (!this.verifyPassword(password, userData.passwordHash)) {
        return { success: false, error: "Incorrect password." };
      }

      // Update last login
      await updateDoc(doc(db, 'admin_users', userDoc.id), {
        lastLogin: new Date(),
        updatedAt: new Date()
      });

      const { passwordHash, ...user } = userData;
      const userWithId = { ...user, id: userDoc.id };
      
      this.currentUser = userWithId;
      this.notifyAuthListeners(userWithId);
      localStorage.setItem('gsf_admin_user', JSON.stringify(userWithId));
      
      return { success: true, user: userWithId };
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
      const q = query(collection(db, 'admin_users'), where('email', '==', userData.email));
      const existingUser = await getDocs(q);
      
      if (!existingUser.empty) {
        return { success: false, error: "Account with this email already exists." };
      }

      const passwordHash = this.hashPassword(userData.password);
      const newUser = {
        email: userData.email,
        displayName: userData.displayName,
        role: userData.role,
        permissions: this.getRolePermissions(userData.role),
        isActive: true,
        passwordHash,
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      const docRef = await addDoc(collection(db, 'admin_users'), newUser);
      const { passwordHash: _, ...userResponse } = newUser;
      const userWithId = { ...userResponse, id: docRef.id };
      
      return { success: true, user: userWithId };
    } catch (error: any) {
      console.error('Create user error:', error);
      return { success: false, error: "Failed to create user." };
    }
  }

  // Sign out
  static async signOut(): Promise<AuthResult> {
    try {
      this.currentUser = null;
      localStorage.removeItem('gsf_admin_user');
      this.notifyAuthListeners(null);
      return { success: true };
    } catch (error: any) {
      return { success: false, error: error.message };
    }
  }

  // Reset password
  static async resetPassword(email: string): Promise<AuthResult> {
    try {
      const tempPassword = Math.random().toString(36).slice(-8);
      const passwordHash = this.hashPassword(tempPassword);

      const q = query(collection(db, 'admin_users'), where('email', '==', email));
      const querySnapshot = await getDocs(q);
      
      if (querySnapshot.empty) {
        return { success: false, error: "No account found with this email." };
      }

      const userDoc = querySnapshot.docs[0];
      await updateDoc(doc(db, 'admin_users', userDoc.id), {
        passwordHash,
        updatedAt: new Date()
      });

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
      await updateDoc(doc(db, 'admin_users', uid), {
        role,
        permissions,
        updatedAt: new Date()
      });
      
      return { success: true };
    } catch (error: any) {
      return { success: false, error: "Failed to update user role." };
    }
  }

  // Get all admin users
  static async getAllAdminUsers(): Promise<User[]> {
    try {
      const querySnapshot = await getDocs(collection(db, 'admin_users'));
      return querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      } as User));
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

  // Get current user
  static getCurrentUser(): User | null {
    if (this.currentUser) return this.currentUser;
    
    const stored = localStorage.getItem('gsf_admin_user');
    if (stored) {
      try {
        this.currentUser = JSON.parse(stored);
        return this.currentUser;
      } catch (error) {
        localStorage.removeItem('gsf_admin_user');
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
      const querySnapshot = await getDocs(collection(db, 'admin_users'));
      if (!querySnapshot.empty) {
        return { success: true, error: "Admin users already exist" };
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
}