"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { createClient } from "@/lib/supabase/client";
import type { Project } from "@/lib/types";
import { SectionWrapper } from "@/components/shared/SectionWrapper";
import { AnimatedHeading } from "@/components/shared/AnimatedHeading";
import { GlassCard } from "@/components/shared/GlassCard";
import { SkeletonCard } from "@/components/shared/SkeletonCard";
import { Badge } from "@/components/ui/badge";
import {
  Github,
  ExternalLink,
  Star,
  ArrowUpRight,
  Folder,
} from "lucide-react";

export function ProjectsSection() {
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);
  const supabase = createClient();

  useEffect(() => {
    async function fetchProjects() {
      const { data } = await supabase
        .from("projects")
        .select("*")
        .eq("published", true)
        .order("created_at", { ascending: false });
      if (data) setProjects(data);
      setLoading(false);
    }
    fetchProjects();
  }, []);

  return (
    <SectionWrapper id="projects">
      <AnimatedHeading subtitle="A selection of projects I've built and contributed to">
        Featured Projects
      </AnimatedHeading>

      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[...Array(6)].map((_, i) => (
            <SkeletonCard key={i} />
          ))}
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {projects.map((project, i) => (
            <GlassCard
              key={project.id}
              initial={{ opacity: 0, y: 40, scale: 0.96 }}
              whileInView={{ opacity: 1, y: 0, scale: 1 }}
              transition={{ duration: 0.5, delay: i * 0.08 }}
              viewport={{ once: true }}
              whileHover={{ y: -6 }}
              className="group relative overflow-hidden"
            >
              {/* Featured badge */}
              {project.featured && (
                <div className="absolute top-4 right-4 z-10">
                  <div className="flex items-center gap-1 px-2.5 py-1 rounded-full bg-gradient-to-r from-amber-500/20 to-orange-500/20 border border-amber-500/30 text-amber-300 text-xs backdrop-blur-sm">
                    <Star className="w-3 h-3 fill-amber-300" />
                    Featured
                  </div>
                </div>
              )}

              {/* Project Image */}
              {project.image_url ? (
                <div className="relative h-48 -mx-6 -mt-6 mb-4 overflow-hidden rounded-t-xl">
                  <img
                    src={project.image_url}
                    alt={project.title}
                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-[#0B0F19] via-[#0B0F19]/40 to-transparent" />
                  {/* Hover overlay with icon */}
                  <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                    <div className="p-3 rounded-full bg-white/10 backdrop-blur-sm border border-white/20">
                      <ArrowUpRight className="w-6 h-6 text-white" />
                    </div>
                  </div>
                </div>
              ) : (
                <div className="h-32 -mx-6 -mt-6 mb-4 rounded-t-xl bg-gradient-to-br from-indigo-500/10 to-violet-500/10 flex items-center justify-center">
                  <Folder className="w-12 h-12 text-indigo-400/40" />
                </div>
              )}

              {/* Content */}
              <div className="space-y-3">
                <h3 className="text-xl font-semibold font-[family-name:var(--font-heading)] group-hover:text-white transition-colors duration-300">
                  {project.title}
                </h3>
                <p className="text-sm text-muted-foreground line-clamp-3 leading-relaxed">
                  {project.description}
                </p>

                {/* Tech Stack */}
                <div className="flex flex-wrap gap-1.5 pt-1">
                  {project.tech_stack.map((tech) => (
                    <Badge
                      key={tech}
                      variant="secondary"
                      className="bg-indigo-500/[0.08] text-indigo-300/90 border-indigo-500/15 text-xs hover:bg-indigo-500/15 transition-colors"
                    >
                      {tech}
                    </Badge>
                  ))}
                </div>

                {/* Links */}
                <div className="flex items-center gap-3 pt-3 border-t border-white/[0.06]">
                  {project.github_url && (
                    <a
                      href={project.github_url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-1.5 text-sm text-muted-foreground hover:text-white transition-colors duration-200"
                      onClick={(e) => e.stopPropagation()}
                    >
                      <Github className="w-4 h-4" />
                      Code
                    </a>
                  )}
                  {project.live_url && (
                    <a
                      href={project.live_url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-1.5 text-sm text-indigo-400 hover:text-indigo-300 transition-colors duration-200 ml-auto group/link"
                      onClick={(e) => e.stopPropagation()}
                    >
                      Live Demo
                      <ArrowUpRight className="w-4 h-4 transition-transform group-hover/link:translate-x-0.5 group-hover/link:-translate-y-0.5" />
                    </a>
                  )}
                </div>
              </div>
            </GlassCard>
          ))}
        </div>
      )}

      {!loading && projects.length === 0 && (
        <div className="text-center py-20">
          <Folder className="w-12 h-12 text-muted-foreground/30 mx-auto mb-4" />
          <p className="text-muted-foreground">
            No projects yet. Add some in the admin dashboard!
          </p>
        </div>
      )}
    </SectionWrapper>
  );
}
