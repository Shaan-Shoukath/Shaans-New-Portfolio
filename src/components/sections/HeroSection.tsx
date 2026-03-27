"use client";

import { useEffect, useState, useRef } from "react";
import { motion } from "framer-motion";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { createClient } from "@/lib/supabase/client";
import type { About } from "@/lib/types";

gsap.registerPlugin(ScrollTrigger);

export function HeroSection() {
  const [about, setAbout] = useState<About | null>(null);
  const supabase = createClient();
  const sectionRef = useRef<HTMLDivElement>(null);
  const taglineRef = useRef<HTMLDivElement>(null);
  const portraitRef = useRef<HTMLDivElement>(null);

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

  // Scroll-driven tagline reveal & parallax
  useEffect(() => {
    const section = sectionRef.current;
    const tagline = taglineRef.current;
    const portrait = portraitRef.current;
    if (!section || !tagline || !portrait) return;

    // Tagline slides up as user scrolls
    gsap.fromTo(
      tagline,
      { y: 80, opacity: 0 },
      {
        y: 0,
        opacity: 1,
        ease: "none",
        scrollTrigger: {
          trigger: section,
          start: "top top",
          end: "bottom top",
          scrub: 1,
        },
      }
    );

    // Portrait subtle parallax
    gsap.to(portrait, {
      y: -40,
      ease: "none",
      scrollTrigger: {
        trigger: section,
        start: "top top",
        end: "bottom top",
        scrub: 1,
      },
    });

    return () => {
      ScrollTrigger.getAll()
        .filter((t) => t.trigger === section)
        .forEach((t) => t.kill());
    };
  }, [about]);

  const tagline = about?.tagline || "Building digital systems across web, mobile, IoT, UAV & AI";

  return (
    <div ref={sectionRef} className="hero-dulcedo">
      {/* Decorative arcs */}
      <motion.div
        className="hero-arc hero-arc--lg"
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ duration: 1.5, delay: 0.3, ease: [0.22, 1, 0.36, 1] }}
      />
      <motion.div
        className="hero-arc hero-arc--xl"
        initial={{ scale: 0.7, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ duration: 1.8, delay: 0.5, ease: [0.22, 1, 0.36, 1] }}
      />

      {/* Subtle ambient glow */}
      <div className="absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-red-600/[0.03] rounded-full blur-[180px] pointer-events-none" />

      {/* Corner HUD markers */}
      <motion.div
        className="absolute top-8 left-8 text-[9px] tracking-[0.3em] text-white/10 font-mono"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.2 }}
      >
        [SYS.PORTFOLIO]
      </motion.div>
      <motion.div
        className="absolute top-8 right-8 text-[9px] tracking-[0.3em] text-white/10 font-mono"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.3 }}
      >
        [v2.0]
      </motion.div>

      {/* Left flank text — SHAAN */}
      <motion.div
        className="hero-dulcedo__flank hero-dulcedo__flank--left"
        initial={{ opacity: 0, x: -30 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 1, delay: 0.6, ease: [0.22, 1, 0.36, 1] }}
      >
        <span className="hero-dulcedo__flank-text">SHAAN</span>
      </motion.div>

      {/* Center portrait */}
      <motion.div
        ref={portraitRef}
        className="hero-dulcedo__portrait"
        initial={{ opacity: 0, y: 40, scale: 0.95 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ duration: 1.2, delay: 0.3, ease: [0.22, 1, 0.36, 1] }}
      >
        {about?.profile_image_url ? (
          <img
            src={about.profile_image_url}
            alt={about.name || "Portrait"}
          />
        ) : (
          /* Stylized placeholder when no image */
          <div className="w-full h-full bg-gradient-to-b from-[#1a1a1a] to-[#0a0a0a] flex items-center justify-center relative overflow-hidden">
            {/* Geometric pattern */}
            <div className="absolute inset-0 opacity-[0.06]"
              style={{
                backgroundImage: `radial-gradient(rgba(220, 38, 38, 0.5) 1px, transparent 1px)`,
                backgroundSize: "20px 20px",
              }}
            />
            <span className="text-7xl font-bold font-[family-name:var(--font-heading)] text-white/[0.06]">
              S
            </span>
            {/* Red accent line */}
            <div className="absolute bottom-0 left-0 right-0 h-[2px] bg-gradient-to-r from-transparent via-red-600/40 to-transparent" />
          </div>
        )}
      </motion.div>

      {/* Right flank text — SHOUKATH */}
      <motion.div
        className="hero-dulcedo__flank hero-dulcedo__flank--right"
        initial={{ opacity: 0, x: 30 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 1, delay: 0.6, ease: [0.22, 1, 0.36, 1] }}
      >
        <span className="hero-dulcedo__flank-text">SHOUKATH</span>
      </motion.div>

      {/* Bottom tagline — reveals on scroll */}
      <div ref={taglineRef} className="hero-dulcedo__tagline">
        <h2 className="font-[family-name:var(--font-heading)]">
          {tagline}
        </h2>
      </div>

      {/* Scroll indicator */}
      <motion.div
        className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 z-20"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.5 }}
      >
        <motion.div
          className="w-[1px] h-8 bg-gradient-to-b from-white/0 via-white/20 to-white/0"
          animate={{ y: [0, 8, 0] }}
          transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
        />
        <span className="text-[8px] tracking-[0.4em] text-white/15 uppercase font-mono">
          scroll
        </span>
      </motion.div>
    </div>
  );
}
