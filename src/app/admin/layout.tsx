"use client";

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
  LogOut,
  Menu,
  X,
  ChevronLeft,
} from "lucide-react";

const sidebarItems = [
  { label: "Dashboard", href: "/admin", icon: LayoutDashboard },
  { label: "About", href: "/admin/about", icon: User },
  { label: "Domains", href: "/admin/domains", icon: Layers },
  { label: "Projects", href: "/admin/projects", icon: FolderKanban },
  { label: "Blogs", href: "/admin/blogs", icon: BookOpen },
];

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const { user, loading, signOut } = useAuth();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const isLoginPage = pathname === "/admin/login";

  // Guard: redirect if not authenticated (only for non-login pages)
  useAdminGuard();

  // Skip layout for login page
  if (isLoginPage) {
    return <>{children}</>;
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="w-8 h-8 border-2 border-indigo-500/30 border-t-indigo-500 rounded-full animate-spin" />
      </div>
    );
  }

  if (!user) return null;

  return (
    <div className="min-h-screen bg-background flex">
      {/* Mobile overlay */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-30 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside
        className={cn(
          "fixed top-0 left-0 bottom-0 w-64 bg-[#0f1629] border-r border-white/5 z-40 flex flex-col transition-transform duration-300 lg:translate-x-0",
          sidebarOpen ? "translate-x-0" : "-translate-x-full"
        )}
      >
        {/* Header */}
        <div className="p-6 border-b border-white/5">
          <div className="flex items-center justify-between">
            <Link href="/admin" className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-lg bg-gradient-to-br from-indigo-500 to-violet-500 flex items-center justify-center text-white font-bold text-sm">
                P
              </div>
              <span className="font-bold font-[family-name:var(--font-heading)]">
                Admin
              </span>
            </Link>
            <button
              onClick={() => setSidebarOpen(false)}
              className="lg:hidden p-1 rounded hover:bg-white/5"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Nav */}
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
                  "flex items-center gap-3 px-4 py-2.5 rounded-lg text-sm transition-all",
                  isActive
                    ? "bg-indigo-500/10 text-indigo-300 border border-indigo-500/20"
                    : "text-muted-foreground hover:text-foreground hover:bg-white/5"
                )}
              >
                <item.icon className="w-4 h-4" />
                {item.label}
              </Link>
            );
          })}
        </nav>

        {/* Bottom */}
        <div className="p-4 border-t border-white/5">
          <Link
            href="/"
            className="flex items-center gap-2 px-4 py-2 rounded-lg text-sm text-muted-foreground hover:text-foreground hover:bg-white/5 transition-all mb-2"
          >
            <ChevronLeft className="w-4 h-4" />
            Back to site
          </Link>
          <div className="flex items-center gap-3 px-4 py-3 rounded-lg bg-white/[0.02] mb-3">
            <div className="w-8 h-8 rounded-full bg-gradient-to-br from-indigo-500/30 to-violet-500/30 flex items-center justify-center text-xs font-medium">
              {user.email?.[0]?.toUpperCase() || "A"}
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-xs text-muted-foreground truncate">
                {user.email}
              </p>
            </div>
          </div>
          <Button
            variant="ghost"
            onClick={signOut}
            className="w-full justify-start text-muted-foreground hover:text-red-400"
          >
            <LogOut className="w-4 h-4 mr-2" />
            Sign out
          </Button>
        </div>
      </aside>

      {/* Main content */}
      <div className="flex-1 lg:ml-64">
        {/* Top bar */}
        <header className="sticky top-0 z-20 px-4 sm:px-6 h-16 flex items-center gap-4 border-b border-white/5 bg-background/80 backdrop-blur-xl">
          <button
            onClick={() => setSidebarOpen(true)}
            className="lg:hidden p-2 rounded-lg hover:bg-white/5"
          >
            <Menu className="w-5 h-5" />
          </button>
          <h1 className="text-lg font-semibold font-[family-name:var(--font-heading)] capitalize">
            {pathname === "/admin"
              ? "Dashboard"
              : pathname.split("/").pop()?.replace(/-/g, " ") || "Admin"}
          </h1>
        </header>

        {/* Content */}
        <main className="p-4 sm:p-6 lg:p-8">{children}</main>
      </div>
    </div>
  );
}
