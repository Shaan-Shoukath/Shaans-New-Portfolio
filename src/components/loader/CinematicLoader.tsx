"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";

export function CinematicLoader({ onComplete }: { onComplete: () => void }) {
  const [phase, setPhase] = useState<"circles" | "text" | "exit">("circles");

  useEffect(() => {
    const t1 = setTimeout(() => setPhase("text"), 800);
    const t2 = setTimeout(() => setPhase("exit"), 2200);
    const t3 = setTimeout(onComplete, 3000);
    return () => {
      clearTimeout(t1);
      clearTimeout(t2);
      clearTimeout(t3);
    };
  }, [onComplete]);

  return (
    <AnimatePresence>
      {phase !== "exit" ? null : undefined}
      <motion.div
        key="loader"
        className="fixed inset-0 z-[100] flex items-center justify-center bg-[#050505]"
        exit={{ opacity: 0 }}
        transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
      >
        {/* Film grain */}
        <div className="film-grain" />

        {/* Animated circles */}
        <div className="relative w-[300px] h-[300px] md:w-[400px] md:h-[400px]">
          {/* Outer circle */}
          <motion.div
            className="absolute inset-0 rounded-full border border-white/20"
            initial={{ scale: 0, opacity: 0 }}
            animate={{
              scale: phase === "exit" ? 3 : 1,
              opacity: phase === "exit" ? 0 : 1,
              rotate: 360,
            }}
            transition={{
              scale: { duration: phase === "exit" ? 0.8 : 1, ease: [0.22, 1, 0.36, 1] },
              opacity: { duration: 0.6 },
              rotate: { duration: 20, repeat: Infinity, ease: "linear" },
            }}
          >
            {/* Tick marks */}
            {[...Array(12)].map((_, i) => (
              <motion.div
                key={i}
                className="absolute top-0 left-1/2 -translate-x-1/2 w-[1px] h-3 bg-white/30"
                style={{ transformOrigin: "50% 150px", rotate: `${i * 30}deg` }}
                initial={{ opacity: 0 }}
                animate={{ opacity: 0.3 }}
                transition={{ delay: 0.1 * i }}
              />
            ))}
          </motion.div>

          {/* Inner circle */}
          <motion.div
            className="absolute inset-8 md:inset-12 rounded-full border border-red-600/40"
            initial={{ scale: 0, opacity: 0 }}
            animate={{
              scale: phase === "exit" ? 4 : 1,
              opacity: phase === "exit" ? 0 : 1,
              rotate: -360,
            }}
            transition={{
              scale: {
                duration: phase === "exit" ? 0.8 : 1.2,
                delay: 0.2,
                ease: [0.22, 1, 0.36, 1],
              },
              opacity: { duration: 0.6, delay: 0.2 },
              rotate: { duration: 15, repeat: Infinity, ease: "linear" },
            }}
          />

          {/* Red dot accent */}
          <motion.div
            className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-2 h-2 rounded-full bg-red-600"
            initial={{ scale: 0 }}
            animate={{
              scale: phase === "exit" ? 0 : [0, 1, 0.8, 1],
            }}
            transition={{ duration: 0.5, delay: 0.5 }}
          />

          {/* Floating UI fragments */}
          {["INIT", "SYS", "OK"].map((text, i) => (
            <motion.div
              key={text}
              className="absolute text-[10px] tracking-[0.3em] text-white/20 font-mono uppercase"
              style={{
                top: `${20 + i * 30}%`,
                left: i % 2 === 0 ? "-20%" : "80%",
              }}
              initial={{ opacity: 0, x: i % 2 === 0 ? -20 : 20 }}
              animate={{
                opacity: phase === "text" ? 0.4 : 0,
                x: 0,
                y: [0, -5, 0],
              }}
              transition={{
                opacity: { duration: 0.5, delay: i * 0.15 },
                y: { duration: 3, repeat: Infinity, ease: "easeInOut" },
              }}
            >
              [{text}]
            </motion.div>
          ))}

          {/* Center text */}
          <motion.div
            className="absolute inset-0 flex flex-col items-center justify-center"
            initial={{ opacity: 0 }}
            animate={{ opacity: phase === "text" || phase === "exit" ? 1 : 0 }}
            transition={{ duration: 0.6 }}
          >
            <motion.span
              className="text-2xl md:text-3xl font-bold tracking-[0.2em] uppercase font-[family-name:var(--font-heading)]"
              initial={{ y: 20, opacity: 0 }}
              animate={{
                y: phase === "exit" ? -20 : 0,
                opacity: phase === "exit" ? 0 : 1,
              }}
              transition={{ duration: 0.6, delay: 0.1 }}
            >
              SHAAN
            </motion.span>
            <motion.div
              className="w-12 h-[1px] bg-red-600 my-3"
              initial={{ scaleX: 0 }}
              animate={{ scaleX: phase === "exit" ? 0 : 1 }}
              transition={{ duration: 0.5, delay: 0.3 }}
            />
            <motion.span
              className="text-[10px] tracking-[0.4em] text-white/40 uppercase"
              initial={{ y: 10, opacity: 0 }}
              animate={{
                y: phase === "exit" ? 10 : 0,
                opacity: phase === "exit" ? 0 : 1,
              }}
              transition={{ duration: 0.5, delay: 0.4 }}
            >
              PORTFOLIO
            </motion.span>
          </motion.div>
        </div>

        {/* Bottom progress */}
        <motion.div
          className="absolute bottom-12 left-1/2 -translate-x-1/2 flex items-center gap-3"
          initial={{ opacity: 0 }}
          animate={{ opacity: phase === "text" ? 1 : 0 }}
          transition={{ duration: 0.4, delay: 0.5 }}
        >
          <motion.div
            className="w-24 h-[1px] bg-white/10 overflow-hidden"
          >
            <motion.div
              className="h-full bg-red-600/60"
              initial={{ width: "0%" }}
              animate={{ width: "100%" }}
              transition={{ duration: 1.4, ease: "easeInOut" }}
            />
          </motion.div>
          <span className="text-[9px] tracking-[0.3em] text-white/20 font-mono">
            LOADING
          </span>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}
