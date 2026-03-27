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
  Briefcase,
  LogOut,
  Menu,
  X,
  ChevronLeft,
} from "lucide-react";

const sidebarItems = [
  { label: "Dashboard", href: "/admin", icon: LayoutDashboard },
  { label: "About", href: "/admin/about", icon: User },
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
  const pathname = usePathname();
  const { user, loading, signOut } = useAuth();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const isLoginPage = pathname === "/admin/login";

  useAdminGuard();

  if (isLoginPage) {
    return <>{children}</>;
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#050505]">
        <div className="w-8 h-8 border-2 border-red-500/30 border-t-red-500 rounded-full animate-spin" />
      </div>
    );
  }

  if (!user) return null;

  return (
    <div className="min-h-screen bg-[#050505] flex">
      {/* Mobile overlay */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-black/60 z-30 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside
        className={cn(
          "fixed top-0 left-0 bottom-0 w-64 bg-[#0a0a0a] border-r border-white/[0.04] z-40 flex flex-col transition-transform duration-300 lg:translate-x-0",
          sidebarOpen ? "translate-x-0" : "-translate-x-full"
        )}
      >
        {/* Header */}
        <div className="p-6 border-b border-white/[0.04]">
          <div className="flex items-center justify-between">
            <Link href="/admin" className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-lg bg-red-600/20 border border-red-600/30 flex items-center justify-center text-red-400 font-bold text-sm font-[family-name:var(--font-heading)]">
                S
              </div>
              <span className="font-bold font-[family-name:var(--font-heading)] text-white/80">
                Admin
              </span>
            </Link>
            <button
              onClick={() => setSidebarOpen(false)}
              className="lg:hidden p-1 rounded hover:bg-white/5 cursor-pointer"
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
                  "flex items-center gap-3 px-4 py-2.5 rounded-lg text-sm transition-all cursor-pointer",
                  isActive
                    ? "bg-red-600/10 text-red-400 border border-red-600/15"
                    : "text-white/40 hover:text-white/70 hover:bg-white/[0.03]"
                )}
              >
                <item.icon className="w-4 h-4" />
                {item.label}
              </Link>
            );
          })}
        </nav>

        {/* Bottom */}
        <div className="p-4 border-t border-white/[0.04]">
          <Link
            href="/"
            className="flex items-center gap-2 px-4 py-2 rounded-lg text-sm text-white/30 hover:text-white/60 hover:bg-white/[0.03] transition-all mb-2 cursor-pointer"
          >
            <ChevronLeft className="w-4 h-4" />
            Back to site
          </Link>
          <div className="flex items-center gap-3 px-4 py-3 rounded-lg bg-white/[0.02] mb-3">
            <div className="w-8 h-8 rounded-full bg-red-600/20 border border-red-600/20 flex items-center justify-center text-xs font-medium text-red-400">
              {user.email?.[0]?.toUpperCase() || "A"}
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-xs text-white/30 truncate">
                {user.email}
              </p>
            </div>
          </div>
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

      {/* Main content */}
      <div className="flex-1 lg:ml-64">
        {/* Top bar */}
        <header className="sticky top-0 z-20 px-4 sm:px-6 h-16 flex items-center gap-4 border-b border-white/[0.04] bg-[#050505]/80 backdrop-blur-xl">
          <button
            onClick={() => setSidebarOpen(true)}
            className="lg:hidden p-2 rounded-lg hover:bg-white/5 cursor-pointer"
          >
            <Menu className="w-5 h-5" />
          </button>
          <h1 className="text-lg font-semibold font-[family-name:var(--font-heading)] capitalize text-white/80">
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
