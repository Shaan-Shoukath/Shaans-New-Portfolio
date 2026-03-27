"use client";

/**
 * =============================================================================
 * ADMIN ROUTE GUARD - useAdminGuard
 * =============================================================================
 * 
 * This hook protects admin routes by redirecting unauthenticated users to login.
 * It's a CLIENT-SIDE protection mechanism that works alongside middleware.
 * 
 * HOW IT WORKS:
 * --------------
 * 1. Uses useAuth to get current user state
 * 2. Monitors route changes via usePathname
 * 3. Redirects to /admin/login if:
 *    - Auth loading is complete AND
 *    - No user is logged in AND
 *    - Not already on the login page
 * 
 * SECURITY LAYERS:
 * ----------------
 * This is the SECOND layer of protection:
 * 
 * Layer 1: Middleware (src/middleware.ts)
 *   - Server-side protection at the edge
 *   - Runs BEFORE the page renders
 *   - Blocks unauthenticated requests to /admin/*
 * 
 * Layer 2: useAdminGuard (this hook)
 *   - Client-side protection in React
 *   - Handles edge cases and provides smooth UX
 *   - Shows loading state while checking auth
 * 
 * Layer 3: Supabase RLS (Row Level Security)
 *   - Database-level protection
 *   - Blocks unauthorized database operations
 * 
 * @returns {user} - Current user (from useAuth)
 * @returns {loading} - Loading state (from useAuth)
 * =============================================================================
 */

import { useEffect } from "react";
import { useRouter, usePathname } from "next/navigation";
import { useAuth } from "./useAuth";

export function useAdminGuard() {
  // Get auth state from useAuth hook
  const { user, loading } = useAuth();
  
  // Next.js router for navigation
  const router = useRouter();
  
  // Current route path
  const pathname = usePathname();

  useEffect(() => {
    /**
     * Redirect logic:
     * - Only run when auth loading is complete
     * - Redirect if no user is logged in
     * - Don't redirect if already on login page
     */
    if (!loading && !user && pathname !== "/admin/login") {
      router.push("/admin/login");
    }
  }, [user, loading, router, pathname]);

  // Expose user and loading for use in components
  return { user, loading };
}
