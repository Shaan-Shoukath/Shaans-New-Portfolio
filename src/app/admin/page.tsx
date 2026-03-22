"use client";

import { useEffect, useState } from "react";
import { createClient } from "@/lib/supabase/client";
import { GlassCard } from "@/components/shared/GlassCard";
import {
  Layers,
  FolderKanban,
  BookOpen,
  User,
  TrendingUp,
  Activity,
} from "lucide-react";

interface Stats {
  domains: number;
  projects: number;
  blogs: number;
  publishedBlogs: number;
}

export default function AdminDashboard() {
  const [stats, setStats] = useState<Stats>({
    domains: 0,
    projects: 0,
    blogs: 0,
    publishedBlogs: 0,
  });
  const supabase = createClient();

  useEffect(() => {
    async function fetchStats() {
      const [domains, projects, blogs, publishedBlogs] = await Promise.all([
        supabase.from("domains").select("id", { count: "exact", head: true }),
        supabase.from("projects").select("id", { count: "exact", head: true }),
        supabase.from("blogs").select("id", { count: "exact", head: true }),
        supabase
          .from("blogs")
          .select("id", { count: "exact", head: true })
          .eq("published", true),
      ]);
      setStats({
        domains: domains.count || 0,
        projects: projects.count || 0,
        blogs: blogs.count || 0,
        publishedBlogs: publishedBlogs.count || 0,
      });
    }
    fetchStats();
  }, []);

  const cards = [
    {
      label: "Domains",
      value: stats.domains,
      icon: Layers,
      color: "from-blue-500/20 to-cyan-500/20",
      border: "border-blue-500/20",
    },
    {
      label: "Projects",
      value: stats.projects,
      icon: FolderKanban,
      color: "from-indigo-500/20 to-violet-500/20",
      border: "border-indigo-500/20",
    },
    {
      label: "Blog Posts",
      value: stats.blogs,
      icon: BookOpen,
      color: "from-violet-500/20 to-purple-500/20",
      border: "border-violet-500/20",
    },
    {
      label: "Published",
      value: stats.publishedBlogs,
      icon: TrendingUp,
      color: "from-emerald-500/20 to-teal-500/20",
      border: "border-emerald-500/20",
    },
  ];

  return (
    <div className="space-y-8">
      <div>
        <h2 className="text-2xl font-bold font-[family-name:var(--font-heading)] mb-1">
          Welcome back
        </h2>
        <p className="text-muted-foreground">
          Here&apos;s an overview of your portfolio content.
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {cards.map((card) => (
          <GlassCard key={card.label} hover={false}>
            <div className="flex items-start justify-between">
              <div>
                <p className="text-sm text-muted-foreground mb-1">
                  {card.label}
                </p>
                <p className="text-3xl font-bold font-[family-name:var(--font-heading)]">
                  {card.value}
                </p>
              </div>
              <div
                className={`p-2.5 rounded-xl bg-gradient-to-br ${card.color} border ${card.border}`}
              >
                <card.icon className="w-5 h-5 text-foreground/70" />
              </div>
            </div>
          </GlassCard>
        ))}
      </div>

      {/* Quick actions */}
      <GlassCard hover={false}>
        <h3 className="text-lg font-semibold font-[family-name:var(--font-heading)] mb-4">
          Quick Actions
        </h3>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          <a
            href="/admin/about"
            className="flex items-center gap-3 p-4 rounded-xl bg-white/[0.02] border border-white/5 hover:bg-white/5 transition-all"
          >
            <User className="w-5 h-5 text-indigo-400" />
            <span className="text-sm">Edit About</span>
          </a>
          <a
            href="/admin/projects"
            className="flex items-center gap-3 p-4 rounded-xl bg-white/[0.02] border border-white/5 hover:bg-white/5 transition-all"
          >
            <FolderKanban className="w-5 h-5 text-indigo-400" />
            <span className="text-sm">Manage Projects</span>
          </a>
          <a
            href="/admin/blogs"
            className="flex items-center gap-3 p-4 rounded-xl bg-white/[0.02] border border-white/5 hover:bg-white/5 transition-all"
          >
            <BookOpen className="w-5 h-5 text-indigo-400" />
            <span className="text-sm">Write a Post</span>
          </a>
        </div>
      </GlassCard>
    </div>
  );
}
