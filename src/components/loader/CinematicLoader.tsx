"use client";

import { useEffect, useState, useCallback } from "react";
import { motion } from "framer-motion";

export function CinematicLoader({
  onComplete,
}: {
  onComplete: () => void;
}) {
  const [progress, setProgress] = useState(0);
  const [phase, setPhase] = useState<"loading" | "expanding" | "done">(
    "loading"
  );

  const stableOnComplete = useCallback(onComplete, [onComplete]);

  useEffect(() => {
    let frameId = 0;
    const start = performance.now();
    const duration = 2600;

    const tick = (timestamp: number) => {
      const elapsed = Math.min((timestamp - start) / duration, 1);
      const eased = 1 - Math.pow(1 - elapsed, 3);
      setProgress(Math.round(eased * 100));

      if (elapsed < 1) {
        frameId = window.requestAnimationFrame(tick);
        return;
      }

      setTimeout(() => setPhase("expanding"), 150);
      setTimeout(() => {
        setPhase("done");
        stableOnComplete();
      }, 950);
    };

    frameId = window.requestAnimationFrame(tick);
    return () => window.cancelAnimationFrame(frameId);
  }, [stableOnComplete]);

  const isExpanding = phase === "expanding";
  const isDone = phase === "done";

  if (isDone) return null;

  return (
    <motion.div
      className="loader-stage"
      initial={{ opacity: 1 }}
      animate={isExpanding ? { opacity: 0 } : { opacity: 1 }}
      transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
    >
      {/* Brand name */}
      <motion.div
        className="loader-ring-brand"
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3, duration: 0.8 }}
      >
        SHAAN SHOUKATH
      </motion.div>

      {/* Character GIF + progress */}
      <motion.div
        className="loader-character-area"
        initial={{ opacity: 0, scale: 0.92 }}
        animate={{
          opacity: isExpanding ? 0 : 1,
          scale: isExpanding ? 1.06 : 1,
        }}
        transition={{ duration: 0.5 }}
      >
        {/* shaan.gif */}
        <img
          src="/shaan.gif"
          alt="Shaan"
          className="loader-character-gif"
          loading="eager"
        />

        {/* White progress bar */}
        <div className="loader-progress-bar-outer">
          <div
            className="loader-progress-bar-inner"
            style={{ width: `${progress}%` }}
          />
        </div>

        {/* Counter + label */}
        <div className="loader-counter-row">
          <span className="loader-ring-progress">
            {String(progress).padStart(2, "0")}
          </span>
          <span className="loader-ring-label">LOADING</span>
        </div>
      </motion.div>
    </motion.div>
  );
}
