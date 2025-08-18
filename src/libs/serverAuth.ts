import { cookies } from "next/headers";
import React from "react";
import { fetchUserProfileSSR } from "./auth";
import { UserProfile } from "./userContext";

/**
 * Get user profile data on the server side
 * Use this in your page components, layouts, or server components
 *
 * @returns Promise resolving to user profile data or null
 */
export async function getUserProfileServer(): Promise<{
  user: UserProfile | null;
  isAuthenticated: boolean;
}> {
  try {
    const cookieStore = await cookies();
    const authToken = cookieStore.get("auth-token")?.value;
    if (!authToken) {
      return { user: null, isAuthenticated: false };
    }

    const { user, isValid } = await fetchUserProfileSSR(authToken);

    return {
      user: isValid ? user : null,
      isAuthenticated: isValid,
    };
  } catch (error) {
    return { user: null, isAuthenticated: false };
  }
}

/**
 * Interface for components that receive user profile props
 */
export interface WithUserProfileProps {
  userProfile?: UserProfile | null;
  isAuthenticated?: boolean;
}

/**
 * Higher-order function to wrap page components with user data
 * Use this to provide user data to your page components via props
 */
export function withUserProfile<T extends Record<string, any>>(
  WrappedComponent: React.ComponentType<T & WithUserProfileProps>,
): React.ComponentType<T> {
  return async function WithUserProfileComponent(props: T) {
    const { user, isAuthenticated } = await getUserProfileServer();

    const componentProps = {
      ...props,
      userProfile: user,
      isAuthenticated: isAuthenticated,
    } as T & WithUserProfileProps;

    return React.createElement(WrappedComponent, componentProps);
  };
}

/**
 * Check if user has required role on server side
 */
export async function requireRole(requiredRole: string): Promise<{
  hasAccess: boolean;
  user: UserProfile | null;
  redirectTo?: string;
}> {
  const { user, isAuthenticated } = await getUserProfileServer();

  if (!isAuthenticated || !user) {
    return {
      hasAccess: false,
      user: null,
      redirectTo: "/",
    };
  }

  const hasRole =
    user.role?.type === requiredRole ||
    user.role?.name.toLowerCase() === requiredRole.toLowerCase();

  if (!hasRole) {
    return {
      hasAccess: false,
      user,
      redirectTo: "/unauthorized",
    };
  }

  return {
    hasAccess: true,
    user,
  };
}
