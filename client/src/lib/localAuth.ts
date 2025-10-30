import { User } from "@shared/schema";

export interface AuthResult {
  success: boolean;
  error?: string;
  user?: User;
}

export class LocalAuthService {
  private static currentUser: User | null = null;
  private static authListeners: ((user: User | null) => void)[] = [];

  // Simple password hashing
  private static hashPassword(password: string): string {
    return btoa(password + 'gsf-salt-2024');
  }

  private static verifyPassword(password: string, hash: string): boolean {
    return this.hashPassword(password) === hash;
  }

  // Get stored users from localStorage
  private static getStoredUsers(): (User & { passwordHash: string })[] {
    const stored = localStorage.getItem('gsf_admin_users');
    if (!stored) return [];
    
    try {
      return JSON.parse(stored);
    } catch {
      return [];
    }
  }

  // Save users to localStorage
  private static saveUsers(users: (User & { passwordHash: string })[]) {
    localStorage.setItem('gsf_admin_users', JSON.stringify(users));
  }

  // Sign in with email and password
  static async signIn(email: string, password: string): Promise<AuthResult> {
    try {
      const users = this.getStoredUsers();
      const user = users.find(u => u.email === email);
      
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
      user.lastLogin = new Date();
      user.updatedAt = new Date();
      this.saveUsers(users);

      const { passwordHash, ...userWithoutPassword } = user;
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
      const users = this.getStoredUsers();
      
      // Check if user exists
      if (users.find(u => u.email === userData.email)) {
        return { success: false, error: "Account with this email already exists." };
      }

      const passwordHash = this.hashPassword(userData.password);
      const newUser = {
        id: `user-${Date.now()}`,
        email: userData.email,
        displayName: userData.displayName,
        role: userData.role,
        permissions: this.getRolePermissions(userData.role),
        isActive: true,
        passwordHash,
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      users.push(newUser);
      this.saveUsers(users);

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
      const users = this.getStoredUsers();
      const userIndex = users.findIndex(u => u.email === email);
      
      if (userIndex === -1) {
        return { success: false, error: "No account found with this email." };
      }

      const tempPassword = Math.random().toString(36).slice(-8);
      const passwordHash = this.hashPassword(tempPassword);

      users[userIndex].passwordHash = passwordHash;
      users[userIndex].updatedAt = new Date();
      this.saveUsers(users);

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
      const users = this.getStoredUsers();
      const userIndex = users.findIndex(u => u.id === uid);
      
      if (userIndex === -1) {
        return { success: false, error: "User not found." };
      }

      const permissions = this.getRolePermissions(role);
      users[userIndex].role = role;
      users[userIndex].permissions = permissions;
      users[userIndex].updatedAt = new Date();
      this.saveUsers(users);
      
      return { success: true };
    } catch (error: any) {
      return { success: false, error: "Failed to update user role." };
    }
  }

  // Get all admin users
  static async getAllAdminUsers(): Promise<User[]> {
    try {
      const users = this.getStoredUsers();
      return users.map(({ passwordHash, ...user }) => user as User);
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
      const users = this.getStoredUsers();
      if (users.length > 0) {
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

  // Test connection (always succeeds for localStorage)
  static async testConnection(): Promise<{ success: boolean; message: string }> {
    return {
      success: true,
      message: "Local storage authentication ready"
    };
  }
}