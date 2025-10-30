import { useState, useEffect } from "react";
import { FastAuthService } from "@/lib/fastAuth";
import type { User } from "@shared/schema";

export function useFastAuth() {
  const [user, setUser] = useState<User | null>(FastAuthService.getCurrentUser());
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const unsubscribe = FastAuthService.onAuthStateChanged((newUser) => {
      setUser(newUser);
    });

    return unsubscribe;
  }, []);

  const login = async (email: string, password: string) => {
    setIsLoading(true);
    try {
      const result = await FastAuthService.signIn(email, password);
      return result;
    } finally {
      setIsLoading(false);
    }
  };

  const logout = async () => {
    setIsLoading(true);
    try {
      const result = await FastAuthService.signOut();
      return result;
    } finally {
      setIsLoading(false);
    }
  };

  const isAuthenticated = FastAuthService.isAuthenticated();

  const hasPermission = (permission: string) => {
    return FastAuthService.hasPermission(user, permission);
  };

  return {
    user,
    isAuthenticated,
    isLoading,
    login,
    logout,
    hasPermission
  };
}