/**
 * =============================================================================
 * AUTHENTICATION MIDDLEWARE
 * =============================================================================
 * 
 * This is the SERVER-SIDE route protection for admin pages.
 * It runs on the Edge before any page renders.
 * 
 * HOW IT WORKS:
 * --------------
 * 1. Creates a Supabase server client with cookie access
 * 2. Reads existing session from cookies
 * 3. Checks if user is authenticated
 * 4. Redirects based on route and auth state:
 *    - /admin/login: If already logged in → redirect to /admin
 *    - /admin/*: If not logged in → redirect to /admin/login
 * 
 * PROTECTED ROUTES:
 * -----------------
 * All routes starting with /admin are protected (see config.matcher)
 * 
 * COOKIE HANDLING:
 * ----------------
 * - Supabase stores JWT in HTTP-only cookies
 * - getAll() reads existing cookies from request
 * - setAll() writes new cookies to response
 * - This maintains session across requests
 * 
 * SECURITY FLOW:
 * ---------------
 * Request → Middleware → Check Session → Allow/Redirect
 *                                      ↓
 *                              Supabase Auth API
 *                                      ↓
 *                              Validate JWT token
 * =============================================================================
 */

import { createServerClient } from "@supabase/ssr";
import { NextResponse, type NextRequest } from "next/server";

export async function middleware(request: NextRequest) {
  // Create response object that can be modified with cookies
  let supabaseResponse = NextResponse.next({ request });

  /**
   * Create Supabase server client
   * This client has access to request cookies for reading session
   * and can set response cookies for writing session
   */
  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        // Read all cookies from the incoming request
        getAll() {
          return request.cookies.getAll();
        },
        // Set cookies on both the request and response
        // This ensures session persists across the request lifecycle
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value }) =>
            request.cookies.set(name, value)
          );
          supabaseResponse = NextResponse.next({ request });
          cookiesToSet.forEach(({ name, value, options }) =>
            supabaseResponse.cookies.set(name, value, options)
          );
        },
      },
    }
  );

  /**
   * Get current user from session
   * This validates the JWT token stored in cookies
   * Returns null if no valid session exists
   */
  const {
    data: { user },
  } = await supabase.auth.getUser();

  // Determine which route type the request is for
  const isAdminRoute = request.nextUrl.pathname.startsWith("/admin");
  const isLoginRoute = request.nextUrl.pathname === "/admin/login";

  /**
   * LOGIN PAGE HANDLING
   * -------------------
   * If user is already logged in and tries to access login page,
   * redirect them to the admin dashboard instead
   */
  if (isLoginRoute) {
    if (user) {
      // Already logged in, redirect to admin dashboard
      const url = request.nextUrl.clone();
      url.pathname = "/admin";
      return NextResponse.redirect(url);
    }
    // Not logged in, allow access to login page
    return supabaseResponse;
  }

  /**
   * ADMIN ROUTE PROTECTION
   * ----------------------
   * If user is not logged in and tries to access admin routes,
   * redirect them to the login page
   */
  if (isAdminRoute && !user) {
    const url = request.nextUrl.clone();
    url.pathname = "/admin/login";
    return NextResponse.redirect(url);
  }

  // Allow request to continue
  return supabaseResponse;
}

/**
 * Middleware configuration
 * -----------------------
 * This matcher ensures middleware only runs for admin routes
 * Performance: Other routes skip middleware entirely
 */
export const config = {
  matcher: ["/admin/:path*"],
};
