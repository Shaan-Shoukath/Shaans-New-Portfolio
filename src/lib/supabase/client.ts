"use client";

/**
 * =============================================================================
 * SUPABASE BROWSER CLIENT
 * =============================================================================
 * 
 * Creates a Supabase client for use in BROWSER (client-side) components.
 * This client handles authentication and database operations in the browser.
 * 
 * HOW IT WORKS:
 * --------------
 * 1. Uses createBrowserClient from @supabase/ssr
 * 2. Requires two environment variables:
 *    - NEXT_PUBLIC_SUPABASE_URL: Your Supabase project URL
 *    - NEXT_PUBLIC_SUPABASE_ANON_KEY: Anonymous/public key (safe to expose)
 * 
 * WHY createBrowserClient?
 * ------------------------
 * - Designed for client-side usage (React components, hooks)
 * - Automatically manages auth state via browser cookies
 * - Handles token refresh automatically
 * - Works with Supabase Auth for user sessions
 * 
 * COOKIE MANAGEMENT:
 * -------------------
 * The browser client uses cookies to store the auth session.
 * These are HTTP-only cookies set by the Supabase Auth system.
 * 
 * USAGE:
 * ------
 * import { createClient } from "@/lib/supabase/client";
 * const supabase = createClient();
 * 
 * // Then use:
 * - supabase.auth.getUser() - Get current user
 * - supabase.auth.signInWithPassword() - Login
 * - supabase.auth.signOut() - Logout
 * - supabase.from("table").select() - Query data
 * =============================================================================
 */

import { createBrowserClient } from "@supabase/ssr";

/**
 * Creates and returns a Supabase browser client instance
 * @returns Configured Supabase client for browser use
 */
export function createClient() {
  return createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  );
}
