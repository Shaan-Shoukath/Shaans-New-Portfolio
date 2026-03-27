/**
 * =============================================================================
 * SUPABASE SERVER CLIENT
 * =============================================================================
 * 
 * Creates a Supabase client for use in SERVER components and Server Actions.
 * This client handles authentication and database operations on the server.
 * 
 * HOW IT WORKS:
 * --------------
 * 1. Uses createServerClient from @supabase/ssr
 * 2. Uses Next.js cookies() to access request cookies
 * 3. Provides custom cookie get/set functions
 * 
 * WHEN TO USE:
 * ------------
 * Use this client in:
 * - Server Components (default in Next.js App Router)
 * - Server Actions (functions marked with "use server")
 * - API Routes (pages/api or Route Handlers)
 * 
 * DIFFERENCE FROM BROWSER CLIENT:
 * -------------------------------
 * Browser Client: Uses browser cookies automatically
 * Server Client: Uses Next.js cookie store (more control)
 * 
 * COOKIE HANDLING:
 * ----------------
 * - getAll(): Reads cookies from the incoming request
 * - setAll(): Writes cookies to the response
 * 
 * The try/catch in setAll handles:
 * - Server Components calling during render (safe to ignore)
 * - Middleware will handle cookie refresh if needed
 * 
 * ENVIRONMENT VARIABLES:
 * ----------------------
 * - NEXT_PUBLIC_SUPABASE_URL: Your Supabase project URL  
 * - NEXT_PUBLIC_SUPABASE_ANON_KEY: Anonymous/public key
 * 
 * USAGE:
 * ------
 * import { createClient } from "@/lib/supabase/server";
 * 
 * // In a Server Component:
 * const supabase = await createClient();
 * const { data } = await supabase.from("projects").select();
 * 
 * // In a Server Action:
 * "use server"
 * const supabase = await createClient();
 * await supabase.from("projects").insert({...});
 * =============================================================================
 */

import { createServerClient } from "@supabase/ssr";
import { cookies } from "next/headers";

/**
 * Creates and returns a Supabase server client instance
 * Must be called with await since cookies() is async
 * @returns Configured Supabase client for server use
 */
export async function createClient() {
  // Get Next.js cookie store
  const cookieStore = await cookies();

  return createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        /**
         * Read all cookies from the incoming request
         * Used to get the current auth session
         */
        getAll() {
          return cookieStore.getAll();
        },
        /**
         * Set cookies on the response
         * Used to update session after auth operations
         */
        setAll(cookiesToSet) {
          try {
            cookiesToSet.forEach(({ name, value, options }) =>
              cookieStore.set(name, value, options)
            );
          } catch {
            /**
             * This error can occur when:
             * - setAll() is called during Server Component render
             * - This is expected and safe to ignore
             * - Middleware handles session refresh separately
             */
          }
        },
      },
    }
  );
}
