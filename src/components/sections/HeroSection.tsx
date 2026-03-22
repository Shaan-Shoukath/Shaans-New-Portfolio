"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { createClient } from "@/lib/supabase/client";
import type { About } from "@/lib/types";
import { ChevronDown, Sparkles } from "lucide-react";

export function HeroSection() {
  const [about, setAbout] = useState<About | null>(null);
  const supabase = createClient();

  useEffect(() => {
    async function fetchAbout() {
      const { data } = await supabase.from("about").select("*").limit(1).single();
      if (data) setAbout(data);
    }
    fetchAbout();
  }, []);

  return (
    <section
      id="hero"
      className="relative min-h-screen flex items-center justify-center px-4 sm:px-6 overflow-hidden"
    >
      {/* Background Effects */}
      <div className="absolute inset-0 overflow-hidden">
        {/* Gradient orbs */}
        <div className="absolute top-1/4 -left-32 w-96 h-96 bg-indigo-500/10 rounded-full blur-[120px]" />
        <div className="absolute bottom-1/4 -right-32 w-96 h-96 bg-violet-500/10 rounded-full blur-[120px]" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-blue-500/5 rounded-full blur-[150px]" />

        {/* Grid pattern */}
        <div
          className="absolute inset-0 opacity-[0.03]"
          style={{
            backgroundImage: `linear-gradient(rgba(255,255,255,0.1) 1px, transparent 1px),
                              linear-gradient(90deg, rgba(255,255,255,0.1) 1px, transparent 1px)`,
            backgroundSize: "60px 60px",
          }}
        />
      </div>

      <div className="relative z-10 text-center max-w-4xl mx-auto">
        {/* Sparkle badge */}
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full glass text-sm text-indigo-300 mb-8"
        >
          <Sparkles className="w-4 h-4" />
          <span>Full-Stack Developer & Innovator</span>
        </motion.div>

        {/* Name */}
        <motion.h1
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.3 }}
          className="text-5xl sm:text-6xl md:text-7xl lg:text-8xl font-bold font-[family-name:var(--font-heading)] leading-tight mb-6"
        >
          {about?.name ? (
            <>
              <span className="text-foreground">Hi, I&apos;m </span>
              <span className="gradient-text">{about.name}</span>
            </>
          ) : (
            <>
              <span className="text-foreground">Hi, I&apos;m </span>
              <span className="gradient-text">Developer</span>
            </>
          )}
        </motion.h1>

        {/* Tagline */}
        <motion.p
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.5 }}
          className="text-lg sm:text-xl md:text-2xl text-muted-foreground max-w-2xl mx-auto mb-4"
        >
          {about?.tagline || "Crafting digital experiences with modern technology"}
        </motion.p>

        {/* Quote */}
        {about?.quote && (
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.65 }}
            className="text-sm italic text-muted-foreground/70 max-w-lg mx-auto mb-10"
          >
            &ldquo;{about.quote}&rdquo;
          </motion.p>
        )}

        {/* CTA Buttons */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.7 }}
          className="flex flex-wrap items-center justify-center gap-4 mb-16"
        >
          <a
            href="#projects"
            className="px-8 py-3 rounded-xl bg-gradient-to-r from-indigo-500 to-violet-500 text-white font-medium hover:shadow-lg hover:shadow-indigo-500/25 transition-all duration-300 hover:-translate-y-0.5"
          >
            View Projects
          </a>
          <a
            href="#contact"
            className="px-8 py-3 rounded-xl glass text-foreground font-medium hover:bg-white/10 transition-all duration-300 hover:-translate-y-0.5"
          >
            Get in Touch
          </a>
        </motion.div>

        {/* Scroll Indicator */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.2 }}
          className="absolute bottom-8 left-1/2 -translate-x-1/2"
        >
          <motion.a
            href="#domains"
            animate={{ y: [0, 8, 0] }}
            transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
            className="flex flex-col items-center gap-2 text-muted-foreground/50 hover:text-muted-foreground transition-colors"
          >
            <span className="text-xs uppercase tracking-widest">Scroll</span>
            <ChevronDown className="w-5 h-5" />
          </motion.a>
        </motion.div>
      </div>
    </section>
  );
}
