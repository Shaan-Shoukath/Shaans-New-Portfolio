"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { createClient } from "@/lib/supabase/client";
import type { About } from "@/lib/types";

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

  const displayName = about?.name || "SHAAN";

  return (
    <div className="cinema-panel flex items-center justify-center relative">
      {/* Background grid */}
      <div
        className="absolute inset-0 opacity-[0.03]"
        style={{
          backgroundImage: `linear-gradient(rgba(255,255,255,0.1) 1px, transparent 1px),
                            linear-gradient(90deg, rgba(255,255,255,0.1) 1px, transparent 1px)`,
          backgroundSize: "80px 80px",
        }}
      />

      {/* Corner HUD markers */}
      <div className="absolute top-8 left-8 text-[9px] tracking-[0.3em] text-white/15 font-mono">
        [SYS.PORTFOLIO]
      </div>
      <div className="absolute top-8 right-8 text-[9px] tracking-[0.3em] text-white/15 font-mono">
        [v2.0]
      </div>
      <div className="absolute bottom-8 left-8 text-[9px] tracking-[0.3em] text-white/15 font-mono">
        [001]
      </div>

      {/* Subtle red glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-red-600/[0.03] rounded-full blur-[150px]" />

      {/* Main Content */}
      <div className="relative z-10 text-center max-w-5xl mx-auto px-6">
        {/* Role tag */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.3 }}
          className="inline-flex items-center gap-3 mb-10"
        >
          <div className="w-8 h-[1px] bg-red-600/60" />
          <span className="text-[11px] tracking-[0.35em] text-white/40 uppercase font-mono">
            Full-Stack Developer & Innovator
          </span>
          <div className="w-8 h-[1px] bg-red-600/60" />
        </motion.div>

        {/* Name */}
        <motion.h1
          initial={{ opacity: 0, y: 60 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, delay: 0.5, ease: [0.22, 1, 0.36, 1] }}
          className="text-6xl sm:text-7xl md:text-8xl lg:text-9xl font-bold font-[family-name:var(--font-heading)] leading-[0.95] mb-8 tracking-tight"
        >
          <span className="text-white">{displayName}</span>
        </motion.h1>

        {/* Tagline */}
        <motion.p
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.7 }}
          className="text-base sm:text-lg text-white/30 max-w-xl mx-auto mb-12 leading-relaxed"
        >
          {about?.tagline || "Building digital systems across web, mobile, IoT, UAV & AI"}
        </motion.p>

        {/* CTA */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.9 }}
          className="flex items-center justify-center gap-6"
        >
          <a
            href="#domains"
            className="group flex items-center gap-3 text-[11px] tracking-[0.3em] text-white/50 uppercase hover:text-white transition-colors duration-300"
          >
            <span>Explore</span>
            <svg className="w-4 h-4 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M17 8l4 4m0 0l-4 4m4-4H3" />
            </svg>
          </a>
        </motion.div>
      </div>

      {/* Scroll indicator */}
      <motion.div
        className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.5 }}
      >
        <motion.div
          className="w-[1px] h-8 bg-gradient-to-b from-white/0 via-white/20 to-white/0"
          animate={{ y: [0, 8, 0] }}
          transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
        />
      </motion.div>
    </div>
  );
}
