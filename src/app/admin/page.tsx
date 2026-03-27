"use client";

import { useEffect, useState } from "react";
import { createClient } from "@/lib/supabase/client";
import { GlassCard } from "@/components/shared/GlassCard";
import {
  Layers,
  FolderKanban,
  BookOpen,
  Briefcase,
  TrendingUp,
} from "lucide-react";

interface Stats {
  domains: number;
  projects: number;
  blogs: number;
  experiences: number;
  publishedBlogs: number;
}

export default function AdminDashboard() {
  const [stats, setStats] = useState<Stats>({
    domains: 0,
    projects: 0,
    blogs: 0,
    experiences: 0,
    publishedBlogs: 0,
  });
  const supabase = createClient();

  useEffect(() => {
    async function fetchStats() {
      const [domains, projects, blogs, experiences, publishedBlogs] =
        await Promise.all([
          supabase.from("domains").select("id", { count: "exact", head: true }),
          supabase.from("projects").select("id", { count: "exact", head: true }),
          supabase.from("blogs").select("id", { count: "exact", head: true }),
          supabase.from("experiences").select("id", { count: "exact", head: true }),
          supabase
            .from("blogs")
            .select("id", { count: "exact", head: true })
            .eq("published", true),
        ]);
      setStats({
        domains: domains.count || 0,
        projects: projects.count || 0,
        blogs: blogs.count || 0,
        experiences: experiences.count || 0,
        publishedBlogs: publishedBlogs.count || 0,
      });
    }
    fetchStats();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const cards = [
    {
      label: "Domains",
      value: stats.domains,
      icon: Layers,
      href: "/admin/domains",
    },
    {
      label: "Experience",
      value: stats.experiences,
      icon: Briefcase,
      href: "/admin/experiences",
    },
    {
      label: "Projects",
      value: stats.projects,
      icon: FolderKanban,
      href: "/admin/projects",
    },
    {
      label: "Blog Posts",
      value: stats.blogs,
      icon: BookOpen,
      href: "/admin/blogs",
    },
    {
      label: "Published",
      value: stats.publishedBlogs,
      icon: TrendingUp,
      href: "/admin/blogs",
    },
  ];

  return (
    <div className="space-y-8">
      <div>
        <h2 className="text-2xl font-bold font-[family-name:var(--font-heading)] mb-1 text-white">
          Welcome back
        </h2>
        <p className="text-sm text-white/30">
          Here&apos;s an overview of your portfolio content.
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
        {cards.map((card) => (
          <a key={card.label} href={card.href} className="cursor-pointer">
            <GlassCard hover={true}>
              <div className="flex items-start justify-between">
                <div>
                  <p className="text-xs text-white/30 mb-1 uppercase tracking-wider">
                    {card.label}
                  </p>
                  <p className="text-3xl font-bold font-[family-name:var(--font-heading)] text-white">
                    {card.value}
                  </p>
                </div>
                <div className="p-2.5 rounded-lg bg-red-600/10 border border-red-600/15">
                  <card.icon className="w-5 h-5 text-red-400/70" />
                </div>
              </div>
            </GlassCard>
          </a>
        ))}
      </div>

      {/* Quick actions */}
      <GlassCard hover={false}>
        <h3 className="text-lg font-semibold font-[family-name:var(--font-heading)] mb-4 text-white/80">
          Quick Actions
        </h3>
        <div className="grid grid-cols-1 sm:grid-cols-4 gap-3">
          {[
            { label: "Edit About", href: "/admin/about", icon: Layers },
            { label: "Add Experience", href: "/admin/experiences", icon: Briefcase },
            { label: "Manage Projects", href: "/admin/projects", icon: FolderKanban },
            { label: "Write a Post", href: "/admin/blogs", icon: BookOpen },
          ].map((action) => (
            <a
              key={action.label}
              href={action.href}
              className="flex items-center gap-3 p-4 rounded-lg bg-white/[0.02] border border-white/[0.04] hover:bg-white/[0.04] hover:border-red-600/10 transition-all cursor-pointer"
            >
              <action.icon className="w-5 h-5 text-red-500/50" />
              <span className="text-sm text-white/50">{action.label}</span>
            </a>
          ))}
        </div>
      </GlassCard>
    </div>
  );
}
