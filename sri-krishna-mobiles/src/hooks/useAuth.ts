/**
 * Custom React hooks for authentication
 * Provides easy access to user data, role checks, and auth actions
 */

"use client";

import { useSession, signIn, signOut } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useCallback } from "react";

// Role hierarchy for permission checking
const roleHierarchy: Record<string, number> = {
  superadmin: 4,
  admin: 3,
  staff: 2,
  cashier: 1,
  customer: 0,
};

/**
 * Main authentication hook
 * Returns user data, auth status, and helper functions
 */
export function useAuth() {
  const { data: session, status, update } = useSession();
  const router = useRouter();

  const user = session?.user;
  const isLoading = status === "loading";
  const isAuthenticated = status === "authenticated";
  const isGuest = status === "unauthenticated";

  /**
   * Check if user has specific role
   */
  const hasRole = useCallback(
    (role: string | string[]): boolean => {
      if (!user?.role) return false;
      const roles = Array.isArray(role) ? role : [role];
      return roles.includes(user.role);
    },
    [user?.role]
  );

  /**
   * Check if user has minimum role level
   */
  const hasMinimumRole = useCallback(
    (minRole: string): boolean => {
      if (!user?.role) return false;
      return (roleHierarchy[user.role] || 0) >= (roleHierarchy[minRole] || 0);
    },
    [user?.role]
  );

  /**
   * Check if user is admin or higher
   */
  const isAdmin = useCallback((): boolean => {
    return hasMinimumRole("admin");
  }, [hasMinimumRole]);

  /**
   * Check if user is staff or higher
   */
  const isStaff = useCallback((): boolean => {
    return hasMinimumRole("staff");
  }, [hasMinimumRole]);

  /**
   * Login with credentials
   */
  const login = useCallback(
    async (email: string, password: string, callbackUrl?: string) => {
      const result = await signIn("credentials", {
        email,
        password,
        redirect: false,
        callbackUrl: callbackUrl || "/",
      });

      if (result?.error) {
        throw new Error(result.error);
      }

      if (result?.ok) {
        router.push(callbackUrl || "/");
        router.refresh();
      }

      return result;
    },
    [router]
  );

  /**
   * Login with Google OAuth
   */
  const loginWithGoogle = useCallback(
    async (callbackUrl?: string) => {
      await signIn("google", {
        callbackUrl: callbackUrl || "/",
      });
    },
    []
  );

  /**
   * Logout user
   */
  const logout = useCallback(
    async (callbackUrl?: string) => {
      await signOut({
        redirect: true,
        callbackUrl: callbackUrl || "/",
      });
    },
    []
  );

  /**
   * Update session data
   */
  const updateSession = useCallback(
    async (data: { name?: string; image?: string }) => {
      await update(data);
    },
    [update]
  );

  return {
    // User data
    user,
    userId: user?.id,
    userEmail: user?.email,
    userName: user?.name,
    userImage: user?.image,
    userRole: user?.role,

    // Status
    isLoading,
    isAuthenticated,
    isGuest,

    // Role checks
    hasRole,
    hasMinimumRole,
    isAdmin,
    isStaff,

    // Actions
    login,
    loginWithGoogle,
    logout,
    updateSession,
  };
}

/**
 * Hook for protecting routes based on authentication
 */
export function useRequireAuth(redirectTo: string = "/auth/login") {
  const { isAuthenticated, isLoading } = useAuth();
  const router = useRouter();

  if (!isLoading && !isAuthenticated) {
    router.push(redirectTo);
  }

  return { isLoading, isAuthenticated };
}

/**
 * Hook for protecting admin routes
 */
export function useRequireAdmin(redirectTo: string = "/") {
  const { isAdmin, isLoading, isAuthenticated } = useAuth();
  const router = useRouter();

  if (!isLoading) {
    if (!isAuthenticated) {
      router.push("/auth/login?callbackUrl=/admin");
    } else if (!isAdmin()) {
      router.push(redirectTo);
    }
  }

  return { isLoading, isAdmin: isAdmin() };
}

export default useAuth;
