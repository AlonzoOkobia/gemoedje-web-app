"use client";

import { createContext, ReactNode, useContext, useState } from "react";
import { AuthService } from "./auth";
import { Profile } from "./data";

// Extended user interface for profile data
export interface UserProfile {
  id: number;
  username: string;
  email: string;
  confirmed: boolean;
  blocked: boolean;
  createdAt: string;
  updatedAt: string;
  role?: {
    id: number;
    name: string;
    description: string;
    type: string;
  };
  provider_profile?: Profile;
}

interface UserContextType {
  user: UserProfile | null;
  isLoading: boolean;
  refetchUser: () => Promise<void>;
  logout: () => Promise<void>;
}

const UserContext = createContext<UserContextType | undefined>(undefined);

export interface UserProviderProps {
  children: ReactNode;
  initialUser?: UserProfile | null;
  isLoading?: boolean;
}

export function UserProvider({
  children,
  initialUser = null,
  isLoading = false,
}: UserProviderProps) {
  // refetch user after update
  const [user, setUser] = useState<UserProfile | null>(initialUser);

  const refetchUser = async () => {
    const user = await AuthService.getCurrentUser();
    if (user) {
      setUser(user as UserProfile);
    } else {
      setUser(null);
    }
  };

  const logout = async () => {
    setUser(null);
  };

  const value = {
    user: user,
    isLoading,
    refetchUser,
    logout,
  };

  return <UserContext.Provider value={value}>{children}</UserContext.Provider>;
}

export function useUser() {
  const context = useContext(UserContext);
  if (context === undefined) {
    throw new Error("useUser must be used within a UserProvider");
  }
  return context;
}

// Utility functions for role checking
export function isProvider(user: UserProfile | null): boolean {
  if (!user?.role) return false;
  return (
    user.role.type === "provider" || user.role.name.toLowerCase() === "provider"
  );
}

export function isAdmin(user: UserProfile | null): boolean {
  if (!user?.role) return false;
  return user.role.type === "admin" || user.role.name.toLowerCase() === "admin";
}

export function hasRole(
  user: UserProfile | null,
  requiredRole: string,
): boolean {
  if (!user?.role) return false;
  return (
    user.role.type === requiredRole ||
    user.role.name.toLowerCase() === requiredRole.toLowerCase()
  );
}
