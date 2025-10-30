import type { User } from "@shared/schema";

export interface AuthResult {
  success: boolean;
  error?: string;
  user?: User;
}

export class FastAuthService {
  private static currentUser: User | null = null;
  private static authListeners: ((user: User | null) => void)[] = [];
  private static readonly STORAGE_KEY = 'gsf_admin_user';
  private static readonly SESSION_KEY = 'gsf_admin_session';

  // Initialize auth state from localStorage
  static initialize(): void {
    try {
      const storedUser = localStorage.getItem(this.STORAGE_KEY);
      const storedSession = localStorage.getItem(this.SESSION_KEY);
      
      if (storedUser && storedSession) {
        const user = JSON.parse(storedUser);
        const sessionTime = parseInt(storedSession);
        const currentTime = Date.now();
        
        // Session valid for 24 hours
        if (currentTime - sessionTime < 24 * 60 * 60 * 1000) {
          this.currentUser = {
            ...user,
            createdAt: new Date(user.createdAt),
            updatedAt: new Date(user.updatedAt),
            lastLogin: new Date(user.lastLogin)
          };
          this.notifyAuthListeners(this.currentUser);
        } else {
          // Session expired
          this.clearStorage();
        }
      }
    } catch (error) {
      console.error("Error initializing auth:", error);
      this.clearStorage();
    }
  }

  // Fast sign in with immediate response
  static async signIn(email: string, password: string): Promise<AuthResult> {
    // Quick validation for admin credentials
    if (email === 'admin@gsf.org.eg' && password === 'admin123') {
      const user: User = {
        id: 'admin-001',
        email: 'admin@gsf.org.eg',
        name: 'GSF Administrator',
        displayName: 'GSF Administrator',
        role: 'super_admin',
        permissions: ['all'],
        isActive: true,
        createdAt: new Date('2024-01-01'),
        updatedAt: new Date(),
        lastLogin: new Date()
      };
      
      this.currentUser = user;
      this.saveToStorage(user);
      this.notifyAuthListeners(this.currentUser);
      
      return { success: true, user: this.currentUser };
    }
    
    return { success: false, error: "Invalid credentials" };
  }

  // Sign out and clear storage
  static async signOut(): Promise<AuthResult> {
    this.currentUser = null;
    this.clearStorage();
    this.notifyAuthListeners(null);
    return { success: true };
  }

  // Get current user
  static getCurrentUser(): User | null {
    return this.currentUser;
  }

  // Check if user is authenticated
  static isAuthenticated(): boolean {
    return this.currentUser !== null;
  }

  // Add auth state listener
  static onAuthStateChanged(callback: (user: User | null) => void): () => void {
    this.authListeners.push(callback);
    // Immediately call with current state
    callback(this.currentUser);
    
    // Return unsubscribe function
    return () => {
      this.authListeners = this.authListeners.filter(listener => listener !== callback);
    };
  }

  // Check user permissions
  static hasPermission(user: User | null, permission: string): boolean {
    if (!user) return false;
    
    const permissions = this.getRolePermissions(user.role);
    return permissions.includes(permission) || permissions.includes('all');
  }

  // Get role permissions
  static getRolePermissions(role: User['role']): string[] {
    switch (role) {
      case 'super_admin':
        return ['all'];
      case 'admin':
        return ['read', 'write', 'manage_content', 'manage_users'];
      case 'editor':
        return ['read', 'write', 'manage_content'];
      case 'viewer':
        return ['read'];
      default:
        return [];
    }
  }

  // Private methods
  private static saveToStorage(user: User): void {
    try {
      localStorage.setItem(this.STORAGE_KEY, JSON.stringify(user));
      localStorage.setItem(this.SESSION_KEY, Date.now().toString());
    } catch (error) {
      console.error("Error saving to storage:", error);
    }
  }

  private static clearStorage(): void {
    try {
      localStorage.removeItem(this.STORAGE_KEY);
      localStorage.removeItem(this.SESSION_KEY);
    } catch (error) {
      console.error("Error clearing storage:", error);
    }
  }

  private static notifyAuthListeners(user: User | null): void {
    this.authListeners.forEach(listener => {
      try {
        listener(user);
      } catch (error) {
        console.error("Error in auth listener:", error);
      }
    });
  }
}

// Initialize on module load
FastAuthService.initialize();