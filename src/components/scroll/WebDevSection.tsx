"use client";

import { useRef } from "react";
import { motion, useScroll, useTransform } from "framer-motion";

export function WebDevSection() {
  const containerRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start end", "end start"],
  });

  const scale = useTransform(scrollYProgress, [0.1, 0.4], [0.8, 1]);
  const opacity = useTransform(scrollYProgress, [0.05, 0.2], [0, 1]);

  const navWidth = useTransform(scrollYProgress, [0.15, 0.35], ["0%", "100%"]);
  const heroOpacity = useTransform(scrollYProgress, [0.25, 0.4], [0, 1]);
  const cardsOpacity = useTransform(scrollYProgress, [0.4, 0.55], [0, 1]);
  const cardsY = useTransform(scrollYProgress, [0.4, 0.55], [30, 0]);
  const footerOpacity = useTransform(scrollYProgress, [0.55, 0.7], [0, 1]);

  return (
    <section
      ref={containerRef}
      className="relative h-screen overflow-hidden flex items-center justify-center"
    >
      {/* Background */}
      <div className="absolute inset-0 bg-gradient-to-b from-[#0B0F19] via-[#0e1530] to-[#0B0F19]" />

      <motion.div
        className="relative z-10 w-full max-w-3xl mx-auto px-4"
        style={{ scale, opacity }}
      >
        {/* Browser Frame */}
        <div className="rounded-xl border border-white/10 bg-[#0f1629] overflow-hidden shadow-2xl shadow-indigo-500/5">
          {/* Browser Chrome */}
          <div className="flex items-center gap-2 px-4 py-3 bg-[#0a0f1f] border-b border-white/5">
            <div className="flex gap-1.5">
              <div className="w-3 h-3 rounded-full bg-red-500/70" />
              <div className="w-3 h-3 rounded-full bg-yellow-500/70" />
              <div className="w-3 h-3 rounded-full bg-green-500/70" />
            </div>
            <div className="flex-1 ml-4">
              <div className="max-w-xs mx-auto bg-white/5 rounded-md px-3 py-1.5 text-xs text-muted-foreground text-center">
                https://myportfolio.dev
              </div>
            </div>
          </div>

          {/* Browser Content */}
          <div className="p-6 space-y-6 min-h-[350px]">
            {/* Navbar mockup */}
            <motion.div
              className="h-8 bg-white/5 rounded-lg overflow-hidden"
              style={{ opacity: heroOpacity }}
            >
              <motion.div
                className="h-full bg-gradient-to-r from-indigo-500/20 to-violet-500/20"
                style={{ width: navWidth }}
              />
            </motion.div>

            {/* Hero mockup */}
            <motion.div
              className="space-y-3 py-4"
              style={{ opacity: heroOpacity }}
            >
              <div className="h-8 w-3/4 mx-auto bg-gradient-to-r from-indigo-500/30 to-violet-500/30 rounded-md" />
              <div className="h-4 w-1/2 mx-auto bg-white/5 rounded-md" />
              <div className="flex justify-center gap-3 pt-2">
                <div className="px-6 py-2 rounded-lg bg-indigo-500/30 text-xs text-indigo-300">
                  View Work
                </div>
                <div className="px-6 py-2 rounded-lg bg-white/5 text-xs text-muted-foreground">
                  Contact
                </div>
              </div>
            </motion.div>

            {/* Cards mockup */}
            <motion.div
              className="grid grid-cols-3 gap-3"
              style={{ opacity: cardsOpacity, y: cardsY }}
            >
              {[...Array(3)].map((_, i) => (
                <div
                  key={i}
                  className="rounded-lg border border-white/5 p-3 bg-white/[0.02] space-y-2"
                >
                  <div className="w-full h-16 rounded bg-gradient-to-br from-indigo-500/10 to-violet-500/10" />
                  <div className="h-3 w-3/4 bg-white/10 rounded" />
                  <div className="h-2 w-1/2 bg-white/5 rounded" />
                </div>
              ))}
            </motion.div>

            {/* Footer mockup */}
            <motion.div
              className="h-6 bg-white/3 rounded-lg mt-4"
              style={{ opacity: footerOpacity }}
            />
          </div>
        </div>
      </motion.div>

      {/* Section Label */}
      <div className="absolute inset-0 flex items-end justify-center z-20 pb-16">
        <div className="text-center">
          <motion.h2
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
            className="text-4xl md:text-6xl font-bold font-[family-name:var(--font-heading)] mb-2"
          >
            <span className="gradient-text">Web Development</span>
          </motion.h2>
          <motion.p
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            transition={{ delay: 0.3 }}
            viewport={{ once: true }}
            className="text-muted-foreground"
          >
            Crafting responsive, performant web experiences
          </motion.p>
        </div>
      </div>
    </section>
  );
}
