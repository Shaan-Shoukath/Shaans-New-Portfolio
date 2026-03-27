"use client";

/**
 * =============================================================================
 * AUTHENTICATION HOOK - useAuth
 * =============================================================================
 * 
 * This hook provides authentication state and methods for the entire application.
 * It uses Supabase Auth for managing user sessions.
 * 
 * HOW IT WORKS:
 * --------------
 * 1. On component mount, it fetches the current user from Supabase
 * 2. It subscribes to auth state changes (login/logout events)
 * 3. Provides signIn() and signOut() methods for authentication
 * 
 * SESSION MANAGEMENT:
 * -------------------
 * - Supabase automatically manages JWT tokens in HTTP-only cookies
 * - The session persists across browser refreshes
 * - Auth state changes trigger re-renders via the subscription
 * 
 * @returns {user} - Current authenticated user or null if not logged in
 * @returns {loading} - True while checking initial auth state
 * @returns {signIn} - Function to sign in with email/password
 * @returns {signOut} - Function to sign out the current user
 * =============================================================================
 */

import { useEffect, useState } from "react";
import { createClient } from "@/lib/supabase/client";
import type { User } from "@supabase/supabase-js";

export function useAuth() {
  // Current authenticated user - null if not logged in
  const [user, setUser] = useState<User | null>(null);
  
  // Loading state - true during initial auth check
  const [loading, setLoading] = useState(true);
  
  // Create Supabase browser client (manages auth cookies automatically)
  const supabase = createClient();

  useEffect(() => {
    /**
     * Fetch current user on mount
     * This runs once when the component first renders
     */
    const getUser = async () => {
      const {
        data: { user },
      } = await supabase.auth.getUser();
      setUser(user);
      setLoading(false);
    };

    getUser();

    /**
     * Subscribe to auth state changes
     * This listener fires when:
     * - User logs in (event: "SIGNED_IN")
     * - User logs out (event: "SIGNED_OUT")  
     * - Token is refreshed (event: "TOKEN_REFRESHED")
     * - Session expires (event: "SIGNED_OUT")
     */
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null);
      setLoading(false);
    });

    // Cleanup subscription on unmount to prevent memory leaks
    return () => subscription.unsubscribe();
  }, []);

  /**
   * Sign in with email and password
   * Uses Supabase's signInWithPassword method
   * 
   * @param email - User's email address
   * @param password - User's password
   * @throws Error if credentials are invalid
   */
  const signIn = async (email: string, password: string) => {
    const { error } = await supabase.auth.signInWithPassword({ email, password });
    if (error) throw error;
  };

  /**
   * Sign out the current user
   * Clears the session cookie and updates state
   */
  const signOut = async () => {
    await supabase.auth.signOut();
  };

  return { user, loading, signIn, signOut };
}
