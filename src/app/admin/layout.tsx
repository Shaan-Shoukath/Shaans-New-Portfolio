"use client";

/**
 * =============================================================================
 * ADMIN LAYOUT
 * =============================================================================
 * 
 * This is the main layout wrapper for all admin pages.
 * It handles:
 * - Authentication check and route guarding
 * - Sidebar navigation
 * - User display and sign out
 * 
 * PROTECTION MECHANISM:
 * --------------------
 * Uses useAdminGuard hook to ensure only authenticated
 * users can access admin pages. Unauthenticated users
 * are redirected to /admin/login.
 * 
 * LOADING STATE:
 * --------------
 * While checking authentication, shows a loading spinner.
 * This prevents flash of content or unauthorized access.
 * 
 * USER SESSION:
 * -------------
 * Displays the logged-in user's email in the sidebar.
 * Provides a sign out button that calls supabase.auth.signOut().
 * =============================================================================
 */

import { useState } from "react";
import { usePathname } from "next/navigation";
import Link from "next/link";
import { useAuth } from "@/hooks/useAuth";
import { useAdminGuard } from "@/hooks/useAdminGuard";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import {
  LayoutDashboard,
  User,
  Layers,
  FolderKanban,
  BookOpen,
  Briefcase,
  ImageIcon,
  LogOut,
  Menu,
  X,
  ChevronLeft,
} from "lucide-react";

// Navigation items for the admin sidebar
const sidebarItems = [
  { label: "Dashboard", href: "/admin", icon: LayoutDashboard },
  { label: "About", href: "/admin/about", icon: User },
  { label: "Hero Images", href: "/admin/hero-images", icon: ImageIcon },
  { label: "Domains", href: "/admin/domains", icon: Layers },
  { label: "Experience", href: "/admin/experiences", icon: Briefcase },
  { label: "Projects", href: "/admin/projects", icon: FolderKanban },
  { label: "Blogs", href: "/admin/blogs", icon: BookOpen },
];

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  // Get current route path
  const pathname = usePathname();
  
  // Get auth functions from useAuth
  const { user, loading, signOut } = useAuth();
  
  // Mobile sidebar state
  const [sidebarOpen, setSidebarOpen] = useState(false);
  
  // Check if on login page
  const isLoginPage = pathname === "/admin/login";

  // Activate route guard - redirects if not authenticated
  useAdminGuard();

  // If on login page, render without sidebar
  if (isLoginPage) {
    return <>{children}</>;
  }

  // Show loading spinner while checking auth
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#050505]">
        <div className="w-8 h-8 border-2 border-red-500/30 border-t-red-500 rounded-full animate-spin" />
      </div>
    );
  }

  // If no user (shouldn't happen due to guard), return nothing
  if (!user) return null;

  return (
    <div className="min-h-screen bg-[#050505] flex">
      {/* Mobile overlay - closes sidebar when clicked */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-black/60 z-30 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar navigation */}
      <aside
        className={cn(
          "fixed top-0 left-0 bottom-0 w-64 bg-[#0a0a0a] border-r border-white/4 z-40 flex flex-col transition-transform duration-300 lg:translate-x-0",
          sidebarOpen ? "translate-x-0" : "-translate-x-full"
        )}
      >
        {/* Header with logo */}
        <div className="p-6 border-b border-white/4">
          <div className="flex items-center justify-between">
            <Link href="/admin" className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-lg bg-red-600/20 border border-red-600/30 flex items-center justify-center text-red-400 font-bold text-sm font-heading">
                S
              </div>
              <span className="font-bold font-heading text-white/80">
                Admin
              </span>
            </Link>
            {/* Mobile close button */}
            <button
              onClick={() => setSidebarOpen(false)}
              className="lg:hidden p-1 rounded hover:bg-white/5 cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Navigation links */}
        <nav className="flex-1 p-4 space-y-1">
          {sidebarItems.map((item) => {
            const isActive =
              pathname === item.href ||
              (item.href !== "/admin" && pathname.startsWith(item.href));
            return (
              <Link
                key={item.label}
                href={item.href}
                onClick={() => setSidebarOpen(false)}
                className={cn(
                  "flex items-center gap-3 px-4 py-2.5 rounded-lg text-sm transition-all cursor-pointer",
                  isActive
                    ? "bg-red-600/10 text-red-400 border border-red-600/15"
                    : "text-white/40 hover:text-white/70 hover:bg-white/3"
                )}
              >
                <item.icon className="w-4 h-4" />
                {item.label}
              </Link>
            );
          })}
        </nav>

        {/* Bottom section with user info and logout */}
        <div className="p-4 border-t border-white/4">
          {/* Back to site link */}
          <Link
            href="/"
            className="flex items-center gap-2 px-4 py-2 rounded-lg text-sm text-white/30 hover:text-white/60 hover:bg-white/3 transition-all mb-2 cursor-pointer"
          >
            <ChevronLeft className="w-4 h-4" />
            Back to site
          </Link>
          
          {/* User email display */}
          <div className="flex items-center gap-3 px-4 py-3 rounded-lg bg-white/2 mb-3">
            <div className="w-8 h-8 rounded-full bg-red-600/20 border border-red-600/20 flex items-center justify-center text-xs font-medium text-red-400">
              {user.email?.[0]?.toUpperCase() || "A"}
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-xs text-white/30 truncate">
                {user.email}
              </p>
            </div>
          </div>
          
          {/* Sign out button */}
          <Button
            variant="ghost"
            onClick={signOut}
            className="w-full justify-start text-white/30 hover:text-red-400 cursor-pointer"
          >
            <LogOut className="w-4 h-4 mr-2" />
            Sign out
          </Button>
        </div>
      </aside>

      {/* Main content area */}
      <div className="flex-1 lg:ml-64">
        {/* Top bar with mobile menu toggle */}
        <header className="sticky top-0 z-20 px-4 sm:px-6 h-16 flex items-center gap-4 border-b border-white/4 bg-[#050505]/80 backdrop-blur-xl">
          <button
            onClick={() => setSidebarOpen(true)}
            className="lg:hidden p-2 rounded-lg hover:bg-white/5 cursor-pointer"
          >
            <Menu className="w-5 h-5" />
          </button>
          <h1 className="text-lg font-semibold font-heading capitalize text-white/80">
            {pathname === "/admin"
              ? "Dashboard"
              : pathname.split("/").pop()?.replace(/-/g, " ") || "Admin"}
          </h1>
        </header>

        {/* Page content */}
        <main className="p-4 sm:p-6 lg:p-8">{children}</main>
      </div>
    </div>
  );
}
