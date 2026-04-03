"use client";

import { useEffect, useState, useRef } from "react";
import { motion, useInView } from "framer-motion";
import { createClient } from "@/lib/supabase/client";
import type { Project } from "@/lib/types";
import { Github, ExternalLink, ArrowUpRight } from "lucide-react";

export function ProjectsSection() {
  const [projects, setProjects] = useState<Project[]>([]);
  const supabase = createClient();

  useEffect(() => {
    async function fetchProjects() {
      const { data } = await supabase
        .from("projects")
        .select("*")
        .eq("published", true)
        .order("created_at", { ascending: false });
      if (data) setProjects(data);
    }
    fetchProjects();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <section id="projects" className="relative py-32 min-h-screen">
      {/* Background */}
      <div className="absolute inset-0 bg-[#050505]" />

      {/* Section header */}
      <div className="relative z-10 max-w-6xl mx-auto px-6 mb-20">
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="text-center"
        >
          <span className="text-[11px] tracking-[0.4em] text-red-600/60 uppercase font-mono block mb-4">
            [PROJECTS]
          </span>
          <h2 className="text-5xl md:text-7xl font-bold font-heading tracking-tight mb-4">
            <span className="text-white">Work</span>
          </h2>
          <div className="w-12 h-px bg-red-600/40 mx-auto" />
        </motion.div>
      </div>

      {/* Projects grid */}
      <div className="relative z-10 max-w-6xl mx-auto px-6">
        {/* Connecting line */}
        <div className="absolute left-1/2 top-0 bottom-0 w-px bg-linear-to-b from-transparent via-white/4 to-transparent hidden lg:block" />

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {projects.map((project, i) => (
            <ProjectCard key={project.id} project={project} index={i} />
          ))}
        </div>

        {projects.length === 0 && (
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            className="text-center py-20"
          >
            <p className="text-white/20 text-sm">
              Projects will appear here. Add them from the admin panel.
            </p>
          </motion.div>
        )}
      </div>
    </section>
  );
}

function ProjectCard({
  project,
  index,
}: {
  project: Project;
  index: number;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true, amount: 0.2 });

  return (
    <motion.div
      ref={ref}
      className="group relative"
      initial={{ opacity: 0, y: 50 }}
      animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 50 }}
      transition={{ duration: 0.7, delay: index * 0.1 }}
    >
      {/* Glass card */}
      <div className="glass-card rounded-lg overflow-hidden p-0 cursor-pointer">
        {/* Image */}
        {project.image_url ? (
          <div className="relative h-52 overflow-hidden">
            <img
              src={project.image_url}
              alt={project.title}
              className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105 grayscale group-hover:grayscale-0"
            />
            <div className="absolute inset-0 bg-linear-to-t from-[#050505] via-[#050505]/60 to-transparent" />
            
            {/* Hover overlay */}
            <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
              <div className="p-3 rounded-full glass border-white/10">
                <ArrowUpRight className="w-5 h-5 text-white" />
              </div>
            </div>

            {/* Index */}
            <div className="absolute top-4 left-4 text-[9px] tracking-[0.3em] text-white/30 font-mono">
              [{String(index + 1).padStart(2, "0")}]
            </div>

            {/* Featured badge */}
            {project.featured && (
              <div className="absolute top-4 right-4">
                <span className="text-[9px] tracking-[0.2em] text-red-500/70 uppercase font-mono">
                  ★ FEATURED
                </span>
              </div>
            )}
          </div>
        ) : (
          <div className="h-40 bg-linear-to-br from-white/2 to-transparent flex items-center justify-center">
            <span className="text-white/10 text-5xl font-bold font-heading">
              {String(index + 1).padStart(2, "0")}
            </span>
          </div>
        )}

        {/* Content */}
        <div className="p-6 space-y-4">
          <h3 className="text-lg font-bold font-heading text-white group-hover:text-white/90 transition-colors tracking-tight">
            {project.title}
          </h3>

          {project.description && (
            <p className="text-sm text-white/25 line-clamp-2 leading-relaxed">
              {project.description}
            </p>
          )}

          {/* Tech stack */}
          <div className="flex flex-wrap gap-2">
            {project.tech_stack.map((tech) => (
              <span
                key={tech}
                className="text-[9px] tracking-[0.15em] uppercase text-white/20 px-2 py-1 rounded border border-white/4"
              >
                {tech}
              </span>
            ))}
          </div>

          {/* Links */}
          <div className="flex items-center gap-4 pt-2 border-t border-white/4">
            {project.github_url && (
              <a
                href={project.github_url}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-1.5 text-[11px] text-white/30 hover:text-white transition-colors"
                onClick={(e) => e.stopPropagation()}
              >
                <Github className="w-3.5 h-3.5" />
                <span>Source</span>
              </a>
            )}
            {project.live_url && (
              <a
                href={project.live_url}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-1.5 text-[11px] text-red-500/70 hover:text-red-400 transition-colors ml-auto"
                onClick={(e) => e.stopPropagation()}
              >
                <span>Live</span>
                <ExternalLink className="w-3.5 h-3.5" />
              </a>
            )}
          </div>
        </div>
      </div>

      {/* Connecting line from card to center */}
      <div className="absolute top-1/2 -translate-y-1/2 w-8 h-px bg-white/4 hidden lg:block"
        style={{
          [index % 2 === 0 ? 'right' : 'left']: '-2rem',
        }}
      />
    </motion.div>
  );
}
