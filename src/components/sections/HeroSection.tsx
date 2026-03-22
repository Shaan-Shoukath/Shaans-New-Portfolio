"use client";

import { useEffect, useState, useMemo } from "react";
import { motion } from "framer-motion";
import { createClient } from "@/lib/supabase/client";
import type { About } from "@/lib/types";
import { ChevronDown, Sparkles, ArrowRight } from "lucide-react";

/* ── Floating particle layer ── */
function FloatingParticles() {
  const particles = useMemo(
    () =>
      Array.from({ length: 40 }, (_, i) => ({
        id: i,
        x: Math.random() * 100,
        y: Math.random() * 100,
        size: Math.random() * 3 + 1,
        duration: Math.random() * 15 + 10,
        delay: Math.random() * 5,
        opacity: Math.random() * 0.3 + 0.05,
      })),
    []
  );

  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
      {particles.map((p) => (
        <motion.div
          key={p.id}
          className="absolute rounded-full bg-indigo-400"
          style={{
            left: `${p.x}%`,
            top: `${p.y}%`,
            width: p.size,
            height: p.size,
            opacity: p.opacity,
          }}
          animate={{
            y: [0, -30, 0],
            x: [0, Math.random() * 20 - 10, 0],
            opacity: [p.opacity, p.opacity * 2, p.opacity],
          }}
          transition={{
            duration: p.duration,
            repeat: Infinity,
            delay: p.delay,
            ease: "easeInOut",
          }}
        />
      ))}
    </div>
  );
}

export function HeroSection() {
  const [about, setAbout] = useState<About | null>(null);
  const supabase = createClient();

  useEffect(() => {
    async function fetchAbout() {
      const { data } = await supabase
        .from("about")
        .select("*")
        .limit(1)
        .single();
      if (data) setAbout(data);
    }
    fetchAbout();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const displayName = about?.name || "Developer";

  return (
    <section
      id="hero"
      className="relative min-h-screen flex items-center justify-center px-4 sm:px-6 overflow-hidden"
    >
      {/* ── Background Effects ── */}
      <div className="absolute inset-0 overflow-hidden">
        {/* Gradient orbs */}
        <motion.div
          className="absolute top-1/4 -left-32 w-[500px] h-[500px] bg-indigo-500/12 rounded-full blur-[140px]"
          animate={{ scale: [1, 1.2, 1], opacity: [0.12, 0.18, 0.12] }}
          transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
        />
        <motion.div
          className="absolute bottom-1/4 -right-32 w-[500px] h-[500px] bg-violet-500/12 rounded-full blur-[140px]"
          animate={{ scale: [1, 1.15, 1], opacity: [0.12, 0.16, 0.12] }}
          transition={{
            duration: 10,
            repeat: Infinity,
            ease: "easeInOut",
            delay: 2,
          }}
        />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[700px] bg-cyan-500/6 rounded-full blur-[180px]" />

        {/* Grid pattern */}
        <div
          className="absolute inset-0 opacity-[0.025]"
          style={{
            backgroundImage: `linear-gradient(rgba(255,255,255,0.1) 1px, transparent 1px),
                              linear-gradient(90deg, rgba(255,255,255,0.1) 1px, transparent 1px)`,
            backgroundSize: "60px 60px",
          }}
        />

        {/* Floating particles */}
        <FloatingParticles />
      </div>

      {/* ── Main Content ── */}
      <div className="relative z-10 text-center max-w-5xl mx-auto">
        {/* Sparkle badge */}
        <motion.div
          initial={{ opacity: 0, scale: 0.8, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="inline-flex items-center gap-2 px-5 py-2 rounded-full glass shimmer-border text-sm text-indigo-300 mb-10"
        >
          <Sparkles className="w-4 h-4 animate-glow-pulse" />
          <span>Full-Stack Developer & Innovator</span>
        </motion.div>

        {/* Name */}
        <motion.h1
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.35, ease: [0.22, 1, 0.36, 1] }}
          className="text-5xl sm:text-6xl md:text-7xl lg:text-8xl xl:text-9xl font-bold font-[family-name:var(--font-heading)] leading-[1.05] mb-8"
        >
          <span className="text-foreground">Hi, I&apos;m </span>
          <span className="relative inline-block">
            <span className="gradient-text animate-gradient-shift">
              {displayName}
            </span>
            {/* Underline glow */}
            <motion.span
              className="absolute -bottom-2 left-0 h-1 bg-gradient-to-r from-indigo-500 via-cyan-500 to-violet-500 rounded-full"
              initial={{ width: "0%" }}
              animate={{ width: "100%" }}
              transition={{ duration: 1, delay: 1.2, ease: "easeOut" }}
            />
          </span>
        </motion.h1>

        {/* Tagline */}
        <motion.p
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.55 }}
          className="text-lg sm:text-xl md:text-2xl text-muted-foreground max-w-2xl mx-auto mb-5 leading-relaxed"
        >
          {about?.tagline ||
            "Crafting digital experiences with modern technology"}
        </motion.p>

        {/* Quote */}
        {about?.quote && (
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.7 }}
            className="text-sm italic text-muted-foreground/60 max-w-lg mx-auto mb-12"
          >
            &ldquo;{about.quote}&rdquo;
          </motion.p>
        )}

        {/* CTA Buttons */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.8 }}
          className="flex flex-wrap items-center justify-center gap-4 mb-20"
        >
          <a
            href="#projects"
            className="group relative px-8 py-3.5 rounded-2xl bg-gradient-to-r from-indigo-500 via-violet-500 to-indigo-500 bg-[length:200%_100%] animate-gradient-shift text-white font-semibold hover:shadow-xl hover:shadow-indigo-500/25 transition-all duration-300 hover:-translate-y-1 flex items-center gap-2"
          >
            View Projects
            <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </a>
          <a
            href="#contact"
            className="px-8 py-3.5 rounded-2xl glass-card text-foreground font-semibold hover:bg-white/10 transition-all duration-300 hover:-translate-y-1 gradient-border"
          >
            Get in Touch
          </a>
        </motion.div>

        {/* Scroll Indicator */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.5 }}
          className="absolute bottom-8 left-1/2 -translate-x-1/2"
        >
          <motion.a
            href="#domains"
            animate={{ y: [0, 10, 0] }}
            transition={{ duration: 2.5, repeat: Infinity, ease: "easeInOut" }}
            className="flex flex-col items-center gap-2 text-muted-foreground/40 hover:text-indigo-400 transition-colors duration-300"
          >
            <span className="text-[10px] uppercase tracking-[0.2em] font-medium">
              Explore
            </span>
            <ChevronDown className="w-5 h-5" />
          </motion.a>
        </motion.div>
      </div>
    </section>
  );
}
