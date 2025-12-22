// Serve as a component wrapper to provide auth state throughout the app.
// This context manages user authentication state and provides methods for login, registration, and logout.

import React, { createContext, useContext, useState, useEffect, useCallback } from "react";
import * as authService from "@/services/auth.service";
import { setAccessToken as setAxiosToken } from "@/lib/axios";

// Define the shape of the AuthContext
interface AuthContextType {
  accessToken: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<void>;
  register: (name: string, email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
  logoutAll: () => Promise<void>;
}

// Create the AuthContext with default undefined value
// This will be provided by the AuthProvider
const AuthContext = createContext<AuthContextType | undefined>(undefined);

// AuthProvider component to wrap the app and provide auth state
export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [accessToken, setAccessToken] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Sync access token with axios instance
  const updateToken = useCallback((token: string | null) => {
    setAccessToken(token);
    setAxiosToken(token);
  }, []);

  /**
   * Bootstrap authentication on app load
   * Attempt to refresh access token from refresh token cookie
   */
  const bootstrapAuth = useCallback(async () => {
    try {
      const token = await authService.refreshAccessToken();
      updateToken(token);
    } catch (error) {
      // If refresh fails (401), ignore - user is not logged in
      updateToken(null);
    } finally {
      setIsLoading(false);
    }
  }, [updateToken]);

  // Bootstrap auth on mount
  useEffect(() => {
    bootstrapAuth();
  }, [bootstrapAuth]);

  // Listen for logout events from axios interceptor
  useEffect(() => {
    const handleLogout = () => {
      updateToken(null);
    };

    window.addEventListener("auth:logout", handleLogout);
    return () => window.removeEventListener("auth:logout", handleLogout);
  }, [updateToken]);

  // Auth methods
  // Centralized methods to handle token updates

  const login = async (email: string, password: string) => {
    const token = await authService.login({ email, password });
    updateToken(token);
  };

  const register = async (name: string, email: string, password: string) => {
    const token = await authService.register({ name, email, password });
    updateToken(token);
  };

  const logout = async () => {
    try {
      await authService.logout();
    } finally {
      updateToken(null);
    }
  };

  const logoutAll = async () => {
    try {
      await authService.logoutAll();
    } finally {
      updateToken(null);
    }
  };

  // Initialize context value
  const value: AuthContextType = {
    accessToken,
    isAuthenticated: !!accessToken,
    isLoading,
    login,
    register,
    logout,
    logoutAll,
  };

  // Provide the auth context to children components
  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

// Custom hook to use the AuthContext
export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}
