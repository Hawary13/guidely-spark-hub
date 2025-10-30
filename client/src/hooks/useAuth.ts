import { useState, useEffect } from "react";
import { User } from "@shared/schema";
import { FirestoreAuthService } from "@/lib/firestoreAuth";

export function useAuth() {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = FirestoreAuthService.onAuthStateChanged((userData) => {
      setUser(userData);
      setLoading(false);
    });

    return unsubscribe;
  }, []);

  const login = async (email: string, password: string) => {
    return await FirestoreAuthService.signIn(email, password);
  };

  const logout = async () => {
    const result = await FirestoreAuthService.signOut();
    if (result.success) {
      setUser(null);
    }
    return result;
  };

  const hasPermission = (permission: string) => {
    return FirestoreAuthService.hasPermission(user, permission);
  };

  const isAdmin = () => {
    return user?.role === 'admin' || user?.role === 'super_admin';
  };

  const isSuperAdmin = () => {
    return user?.role === 'super_admin';
  };

  return {
    user,
    loading,
    login,
    logout,
    isAuthenticated: !!user,
    hasPermission,
    isAdmin,
    isSuperAdmin,
  };
}
