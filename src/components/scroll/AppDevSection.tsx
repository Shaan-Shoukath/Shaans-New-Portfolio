"use client";

import { useRef } from "react";
import { motion, useScroll, useTransform } from "framer-motion";

export function AppDevSection() {
  const containerRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start end", "end start"],
  });

  const phoneX = useTransform(scrollYProgress, [0.1, 0.35], [200, 0]);
  const phoneOpacity = useTransform(scrollYProgress, [0.1, 0.3], [0, 1]);
  const screenOpacity = useTransform(scrollYProgress, [0.3, 0.45], [0, 1]);
  const appUIOpacity = useTransform(scrollYProgress, [0.45, 0.6], [0, 1]);
  const glowIntensity = useTransform(scrollYProgress, [0.3, 0.5], [0, 1]);

  return (
    <section
      ref={containerRef}
      className="relative h-screen overflow-hidden flex items-center justify-center"
    >
      <div className="absolute inset-0 bg-gradient-to-b from-[#0B0F19] via-[#120f25] to-[#0B0F19]" />

      {/* Floating particles */}
      <div className="absolute inset-0 overflow-hidden">
        {[...Array(15)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute w-1 h-1 bg-violet-400/30 rounded-full"
            style={{
              top: `${20 + Math.random() * 60}%`,
              left: `${Math.random() * 100}%`,
            }}
            animate={{
              y: [0, -20, 0],
              opacity: [0.1, 0.5, 0.1],
            }}
            transition={{
              duration: 3 + Math.random() * 2,
              repeat: Infinity,
              delay: Math.random() * 3,
            }}
          />
        ))}
      </div>

      {/* Phone mockup */}
      <motion.div
        className="relative z-10"
        style={{ x: phoneX, opacity: phoneOpacity }}
      >
        {/* Phone glow */}
        <motion.div
          className="absolute inset-0 -m-8 rounded-[3rem] bg-violet-500/10 blur-3xl"
          style={{ opacity: glowIntensity }}
        />

        {/* Phone frame */}
        <div className="relative w-[260px] h-[520px] rounded-[2.5rem] border-[3px] border-white/15 bg-[#0a0d1a] overflow-hidden shadow-2xl">
          {/* Notch */}
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-28 h-6 bg-[#0a0d1a] rounded-b-2xl z-20" />

          {/* Screen */}
          <motion.div
            className="absolute inset-0 m-[2px] rounded-[2.3rem] overflow-hidden"
            style={{ opacity: screenOpacity }}
          >
            {/* Screen content - status bar */}
            <div className="px-6 pt-8 flex justify-between text-[10px] text-white/40">
              <span>9:41</span>
              <div className="flex gap-1">
                <div className="w-3 h-2 border border-white/30 rounded-sm" />
              </div>
            </div>

            {/* App UI */}
            <motion.div
              className="px-5 pt-6 space-y-4"
              style={{ opacity: appUIOpacity }}
            >
              {/* Header */}
              <div className="space-y-1">
                <div className="h-6 w-3/4 bg-gradient-to-r from-violet-500/40 to-indigo-500/40 rounded" />
                <div className="h-3 w-1/2 bg-white/5 rounded" />
              </div>

              {/* Card */}
              <div className="rounded-2xl bg-white/5 p-4 border border-white/5 space-y-3">
                <div className="w-full h-24 rounded-xl bg-gradient-to-br from-violet-500/15 to-indigo-500/15" />
                <div className="h-3 w-2/3 bg-white/10 rounded" />
                <div className="h-2 w-full bg-white/5 rounded" />
              </div>

              {/* List items */}
              {[...Array(3)].map((_, i) => (
                <div
                  key={i}
                  className="flex items-center gap-3 p-3 rounded-xl bg-white/[0.02] border border-white/5"
                >
                  <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-violet-500/20 to-indigo-500/20" />
                  <div className="flex-1 space-y-1.5">
                    <div className="h-2.5 w-3/4 bg-white/10 rounded" />
                    <div className="h-2 w-1/2 bg-white/5 rounded" />
                  </div>
                </div>
              ))}

              {/* Bottom nav */}
              <div className="flex justify-around pt-4 border-t border-white/5">
                {[...Array(4)].map((_, i) => (
                  <div
                    key={i}
                    className={`w-6 h-6 rounded-lg ${
                      i === 0
                        ? "bg-violet-500/30"
                        : "bg-white/5"
                    }`}
                  />
                ))}
              </div>
            </motion.div>
          </motion.div>

          {/* Home indicator */}
          <div className="absolute bottom-2 left-1/2 -translate-x-1/2 w-28 h-1 bg-white/20 rounded-full" />
        </div>
      </motion.div>

      {/* Label */}
      <div className="absolute inset-0 flex items-end justify-center z-20 pb-16">
        <div className="text-center">
          <motion.h2
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
            className="text-4xl md:text-6xl font-bold font-[family-name:var(--font-heading)] mb-2"
          >
            <span className="gradient-text">App Development</span>
          </motion.h2>
          <motion.p
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            transition={{ delay: 0.3 }}
            viewport={{ once: true }}
            className="text-muted-foreground"
          >
            Native & cross-platform mobile experiences
          </motion.p>
        </div>
      </div>
    </section>
  );
}
