"use client";

import React, {
  useEffect,
  useRef,
  useState,
} from "react";
import { motion, AnimatePresence } from "framer-motion";
import { createClient } from "@/lib/supabase/client";
import type { Project } from "@/lib/types";
import { Github, ExternalLink, BookOpen } from "lucide-react";

// ─── Fallback data ────────────────────────────────────────────────────────────
const FALLBACK_PROJECTS: Project[] = [
  {
    id: "p-1",
    title: "Aarannu Platform",
    description:
      "A full-stack SaaS platform for institution-scale membership management. Built with Next.js, Node.js, and PostgreSQL with multi-role authorization and bulk import workflows.",
    tech_stack: ["Next.js", "Node.js", "PostgreSQL", "Supabase"],
    github_url: "https://github.com",
    live_url: "https://aaraanu.shaans.works",
    medium_url: null,
    image_url: "https://picsum.photos/seed/aarannu/900/600",
    featured: true,
    published: true,
    order_index: 0,
    created_at: "",
  },
  {
    id: "p-2",
    title: "Arakiro",
    description:
      "Autonomous UAV swarm coordination system with ROS2 middleware, ArduPilot & PX4 flight controllers, and real-time computer vision via OpenCV for obstacle detection and formation control.",
    tech_stack: ["ArduPilot", "PX4", "ROS2", "Python", "OpenCV"],
    github_url: "https://github.com",
    live_url: null,
    medium_url: null,
    image_url: "https://picsum.photos/seed/arakiro-uav/900/600",
    featured: true,
    published: true,
    order_index: 1,
    created_at: "",
  },
  {
    id: "p-3",
    title: "Cinematic Portfolio",
    description:
      "This very portfolio — a GSAP-powered cinematic experience with horizontal scroll sections, animated loader, and Supabase CMS backend.",
    tech_stack: ["Next.js", "GSAP", "Supabase", "Tailwind"],
    github_url: "https://github.com",
    live_url: "https://shaan.dev",
    medium_url: null,
    image_url: "https://picsum.photos/seed/portfolio-cin/900/600",
    featured: true,
    published: true,
    order_index: 2,
    created_at: "",
  },
  {
    id: "p-4",
    title: "IoT Plant Monitor",
    description:
      "ESP32-based smart plant monitoring system with real-time soil moisture, temperature, and humidity tracking sent to a web dashboard via MQTT.",
    tech_stack: ["ESP32", "MQTT", "React", "Node.js"],
    github_url: "https://github.com",
    live_url: null,
    medium_url: null,
    image_url: "https://picsum.photos/seed/iot-plant/900/600",
    featured: false,
    published: true,
    order_index: 3,
    created_at: "",
  },
  {
    id: "p-5",
    title: "Neural Classifier",
    description:
      "Deep learning image classification pipeline using PyTorch with custom CNN architecture achieving 96% accuracy on benchmark datasets.",
    tech_stack: ["PyTorch", "Python", "CUDA", "FastAPI"],
    github_url: "https://github.com",
    live_url: null,
    medium_url: "https://medium.com",
    image_url: "https://picsum.photos/seed/neural-cls/900/600",
    featured: false,
    published: true,
    order_index: 4,
    created_at: "",
  },
];

export function ProjectsSection() {
  const [projects, setProjects] = useState<Project[]>([]);
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });
  const sectionRef = useRef<HTMLElement>(null);
  const supabase = useRef(createClient()).current;

  useEffect(() => {
    let cancelled = false;
    async function fetch() {
      const { data } = await supabase
        .from("projects")
        .select("*")
        .eq("published", true)
        .order("order_index", { ascending: true });
      if (cancelled) return;
      if (data && data.length > 0) setProjects(data);
      else setProjects(FALLBACK_PROJECTS);
    }
    void fetch();
    return () => { cancelled = true; };
  }, [supabase]);

  const displayProjects = projects.length > 0 ? projects : FALLBACK_PROJECTS;

  const handleMouseMove = (e: React.MouseEvent) => {
    setMousePos({ x: e.clientX, y: e.clientY });
  };

  return (
    <section
      id="projects"
      ref={sectionRef}
      className="works-namma-stage"
      onMouseMove={handleMouseMove}
    >
      {/* Floating image preview */}
      <AnimatePresence>
        {hoveredIndex !== null && displayProjects[hoveredIndex]?.image_url && (
          <motion.div
            className="works-namma-preview"
            initial={{ opacity: 0, scale: 0.88 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.88 }}
            transition={{ duration: 0.22, ease: [0.22, 1, 0.36, 1] }}
            style={{
              left: mousePos.x + 24,
              top: mousePos.y - 80,
            }}
          >
            <img
              src={displayProjects[hoveredIndex]!.image_url!}
              alt={displayProjects[hoveredIndex]!.title}
              className="works-namma-preview__img"
            />
          </motion.div>
        )}
      </AnimatePresence>

      <div className="works-namma-inner">
        {/* Header */}
        <motion.div
          className="works-namma-header"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          <span className="works-namma-eyebrow">Selected Work</span>
          <h2 className="works-namma-section-title">
            <span className="works-namma-section-title__main">Projects</span>
            <span className="works-namma-section-title__sub">&amp; Works</span>
          </h2>
        </motion.div>

        {/* Project list */}
        <ul className="works-namma-list" role="list">
          {displayProjects.map((project, index) => (
            <ProjectRow
              key={project.id}
              project={project}
              index={index}
              total={displayProjects.length}
              isHovered={hoveredIndex === index}
              anyHovered={hoveredIndex !== null}
              onMouseEnter={() => setHoveredIndex(index)}
              onMouseLeave={() => setHoveredIndex(null)}
            />
          ))}
        </ul>

        {/* Footer row */}
        <motion.div
          className="works-namma-footer"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ delay: 0.4, duration: 0.6 }}
        >
          <span className="works-namma-footer__count">
            {String(displayProjects.length).padStart(2, "0")} Projects
          </span>
          <div className="works-namma-footer__line" />
          <span className="works-namma-footer__label">Scroll to explore</span>
        </motion.div>
      </div>
    </section>
  );
}

// ─── Individual project row ───────────────────────────────────────────────────
function ProjectRow({
  project,
  index,
  total,
  isHovered,
  anyHovered,
  onMouseEnter,
  onMouseLeave,
}: {
  project: Project;
  index: number;
  total: number;
  isHovered: boolean;
  anyHovered: boolean;
  onMouseEnter: () => void;
  onMouseLeave: () => void;
}) {
  return (
    <motion.li
      className={`works-namma-row ${isHovered ? "works-namma-row--hovered" : ""} ${anyHovered && !isHovered ? "works-namma-row--dimmed" : ""}`}
      initial={{ opacity: 0, x: -30 }}
      whileInView={{ opacity: 1, x: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.55, delay: index * 0.07 }}
      onMouseEnter={onMouseEnter}
      onMouseLeave={onMouseLeave}
    >
      {/* Index */}
      <span className="works-namma-row__index">
        {String(index + 1).padStart(2, "0")}
      </span>

      {/* Title */}
      <h3 className="works-namma-row__title">{project.title}</h3>

      {/* Tags — visible on hover */}
      <div className="works-namma-row__tags">
        {project.tech_stack?.slice(0, 3).map((tag) => (
          <span key={tag} className="works-namma-row__tag">
            {tag}
          </span>
        ))}
      </div>

      {/* Links — always visible, open on click */}
      <div className="works-namma-row__links">
        {project.github_url && (
          <a
            href={project.github_url}
            target="_blank"
            rel="noopener noreferrer"
            className="works-namma-row__link"
            title="View on GitHub"
            aria-label="View on GitHub"
            onClick={(e) => e.stopPropagation()}
          >
            <Github size={15} />
            <span className="works-namma-row__link-label">GitHub</span>
          </a>
        )}
        {project.medium_url && (
          <a
            href={project.medium_url}
            target="_blank"
            rel="noopener noreferrer"
            className="works-namma-row__link"
            title="Read on Medium"
            aria-label="Read on Medium"
            onClick={(e) => e.stopPropagation()}
          >
            <BookOpen size={15} />
            <span className="works-namma-row__link-label">Article</span>
          </a>
        )}
        {project.live_url && (
          <a
            href={project.live_url}
            target="_blank"
            rel="noopener noreferrer"
            className="works-namma-row__link works-namma-row__link--live"
            title="View live project"
            aria-label="View live project"
            onClick={(e) => e.stopPropagation()}
          >
            <ExternalLink size={15} />
            <span className="works-namma-row__link-label">Live</span>
          </a>
        )}
      </div>

      {/* Bottom border */}
      <div className="works-namma-row__border" />
    </motion.li>
  );
}
