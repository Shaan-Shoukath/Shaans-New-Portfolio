"use client";

import { useRef } from "react";
import { motion, useScroll, useTransform } from "framer-motion";

export function UAVSection() {
  const containerRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start end", "end start"],
  });

  const droneX = useTransform(scrollYProgress, [0, 1], ["-20%", "110%"]);
  const droneY = useTransform(scrollYProgress, [0, 0.3, 0.5, 0.7, 1], [60, 30, 50, 20, 40]);
  const droneRotate = useTransform(scrollYProgress, [0, 0.25, 0.5, 0.75, 1], [-5, 3, -3, 5, -2]);
  const skyGradient = useTransform(
    scrollYProgress,
    [0, 0.5, 1],
    [
      "linear-gradient(180deg, #0c1445 0%, #1a1145 50%, #0B0F19 100%)",
      "linear-gradient(180deg, #1e3a6e 0%, #2d2060 50%, #0B0F19 100%)",
      "linear-gradient(180deg, #0c1445 0%, #1a1145 50%, #0B0F19 100%)",
    ]
  );
  const cloudOpacity = useTransform(scrollYProgress, [0, 0.3, 0.7, 1], [0.1, 0.4, 0.3, 0.1]);

  return (
    <section
      ref={containerRef}
      className="relative h-screen overflow-hidden"
    >
      <motion.div className="absolute inset-0" style={{ background: skyGradient }} />

      {/* Stars */}
      <div className="absolute inset-0 overflow-hidden">
        {[...Array(30)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute w-1 h-1 bg-white rounded-full"
            style={{
              top: `${Math.random() * 60}%`,
              left: `${Math.random() * 100}%`,
              opacity: Math.random() * 0.5 + 0.2,
            }}
            animate={{ opacity: [0.2, 0.8, 0.2] }}
            transition={{
              duration: 2 + Math.random() * 3,
              repeat: Infinity,
              delay: Math.random() * 2,
            }}
          />
        ))}
      </div>

      {/* Clouds */}
      <motion.div
        className="absolute top-1/4 left-0 right-0 flex justify-between"
        style={{ opacity: cloudOpacity }}
      >
        {[...Array(4)].map((_, i) => (
          <div
            key={i}
            className="w-32 h-12 bg-white/5 rounded-full blur-xl"
            style={{ marginTop: `${i * 20}px` }}
          />
        ))}
      </motion.div>

      {/* Drone SVG */}
      <motion.div
        className="absolute top-1/2 -translate-y-1/2"
        style={{ left: droneX, y: droneY, rotate: droneRotate }}
      >
        <svg width="80" height="50" viewBox="0 0 80 50" fill="none" className="drop-shadow-2xl">
          {/* Body */}
          <rect x="20" y="18" width="40" height="14" rx="7" fill="#818CF8" />
          {/* Arms */}
          <line x1="8" y1="25" x2="25" y2="25" stroke="#A78BFA" strokeWidth="2.5" />
          <line x1="55" y1="25" x2="72" y2="25" stroke="#A78BFA" strokeWidth="2.5" />
          <line x1="20" y1="15" x2="30" y2="18" stroke="#A78BFA" strokeWidth="2" />
          <line x1="60" y1="15" x2="50" y2="18" stroke="#A78BFA" strokeWidth="2" />
          {/* Propellers */}
          <motion.ellipse
            cx="8" cy="22" rx="8" ry="2" fill="rgba(167,139,250,0.6)"
            animate={{ scaleX: [1, 0.3, 1] }}
            transition={{ duration: 0.15, repeat: Infinity }}
          />
          <motion.ellipse
            cx="72" cy="22" rx="8" ry="2" fill="rgba(167,139,250,0.6)"
            animate={{ scaleX: [0.3, 1, 0.3] }}
            transition={{ duration: 0.15, repeat: Infinity }}
          />
          {/* Camera */}
          <circle cx="40" cy="35" r="3" fill="#60A5FA" />
          <rect x="37" y="32" width="6" height="4" rx="1" fill="#4F46E5" />
          {/* LEDs */}
          <motion.circle
            cx="22" cy="25" r="1.5" fill="#34D399"
            animate={{ opacity: [1, 0.3, 1] }}
            transition={{ duration: 1, repeat: Infinity }}
          />
          <motion.circle
            cx="58" cy="25" r="1.5" fill="#EF4444"
            animate={{ opacity: [0.3, 1, 0.3] }}
            transition={{ duration: 1, repeat: Infinity }}
          />
        </svg>
      </motion.div>

      {/* Trail */}
      <motion.div
        className="absolute top-1/2 -translate-y-1/2 h-[2px] bg-gradient-to-r from-transparent via-indigo-400/30 to-transparent"
        style={{
          left: 0,
          width: droneX,
          y: droneY,
        }}
      />

      {/* Content Overlay */}
      <div className="absolute inset-0 flex items-center justify-center z-10">
        <div className="text-center">
          <motion.h2
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
            className="text-4xl md:text-6xl font-bold font-[family-name:var(--font-heading)] mb-4"
          >
            <span className="gradient-text">UAV Development</span>
          </motion.h2>
          <motion.p
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            transition={{ delay: 0.3 }}
            viewport={{ once: true }}
            className="text-muted-foreground text-lg max-w-md mx-auto"
          >
            Building autonomous drone systems with precision flight control
          </motion.p>
        </div>
      </div>
    </section>
  );
}
