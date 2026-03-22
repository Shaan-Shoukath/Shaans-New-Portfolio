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
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: i * 0.08 }}
              viewport={{ once: true }}
              whileHover={{ y: -5 }}
              className="group relative overflow-hidden"
            >
              {/* Featured badge */}
              {project.featured && (
                <div className="absolute top-4 right-4 z-10">
                  <div className="flex items-center gap-1 px-2 py-1 rounded-full bg-gradient-to-r from-amber-500/20 to-orange-500/20 border border-amber-500/30 text-amber-300 text-xs">
                    <Star className="w-3 h-3 fill-amber-300" />
                    Featured
                  </div>
                </div>
              )}

              {/* Project Image */}
              {project.image_url && (
                <div className="relative h-48 -mx-6 -mt-6 mb-4 overflow-hidden rounded-t-xl">
                  <img
                    src={project.image_url}
                    alt={project.title}
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-[#0B0F19] to-transparent" />
                </div>
              )}

              {/* Content */}
              <div className="space-y-3">
                <h3 className="text-xl font-semibold font-[family-name:var(--font-heading)] group-hover:text-indigo-300 transition-colors">
                  {project.title}
                </h3>
                <p className="text-sm text-muted-foreground line-clamp-3">
                  {project.description}
                </p>

                {/* Tech Stack */}
                <div className="flex flex-wrap gap-1.5 pt-1">
                  {project.tech_stack.map((tech) => (
                    <Badge
                      key={tech}
                      variant="secondary"
                      className="bg-indigo-500/10 text-indigo-300 border-indigo-500/20 text-xs"
                    >
                      {tech}
                    </Badge>
                  ))}
                </div>

                {/* Links */}
                <div className="flex items-center gap-3 pt-3 border-t border-white/5">
                  {project.github_url && (
                    <a
                      href={project.github_url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground transition-colors"
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
                      className="flex items-center gap-1.5 text-sm text-indigo-400 hover:text-indigo-300 transition-colors ml-auto"
                    >
                      Live Demo
                      <ArrowUpRight className="w-4 h-4" />
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
          <p className="text-muted-foreground">
            No projects yet. Add some in the admin dashboard!
          </p>
        </div>
      )}
    </SectionWrapper>
  );
}
