"use client";

import { useEffect, useState } from "react";
import { motion, useMotionValue, useSpring, useTransform } from "framer-motion";

const loaderRadius = 128;
const loaderCircumference = 2 * Math.PI * loaderRadius;

export function CinematicLoader({ onComplete }: { onComplete: () => void }) {
  const [progress, setProgress] = useState(0);
  const [isExiting, setIsExiting] = useState(false);
  const pointerX = useMotionValue(0);
  const pointerY = useMotionValue(0);
  const ringX = useSpring(pointerX, {
    stiffness: 85,
    damping: 18,
    mass: 0.7,
  });
  const ringY = useSpring(pointerY, {
    stiffness: 85,
    damping: 18,
    mass: 0.7,
  });
  const haloX = useTransform(ringX, (value) => value * 1.55);
  const haloY = useTransform(ringY, (value) => value * 1.25);

  useEffect(() => {
    let frameId = 0;
    let exitTimeout = 0;
    let completeTimeout = 0;
    const start = performance.now();
    const duration = 2400;

    const tick = (timestamp: number) => {
      const elapsed = Math.min((timestamp - start) / duration, 1);
      const eased = 1 - Math.pow(1 - elapsed, 3);

      setProgress(Math.round(eased * 100));

      if (elapsed < 1) {
        frameId = window.requestAnimationFrame(tick);
        return;
      }

      exitTimeout = window.setTimeout(() => setIsExiting(true), 120);
      completeTimeout = window.setTimeout(onComplete, 760);
    };

    frameId = window.requestAnimationFrame(tick);

    return () => {
      window.cancelAnimationFrame(frameId);
      window.clearTimeout(exitTimeout);
      window.clearTimeout(completeTimeout);
    };
  }, [onComplete]);

  useEffect(() => {
    const prefersReducedMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)"
    ).matches;
    const allowsFinePointer = window.matchMedia("(pointer: fine)").matches;

    if (prefersReducedMotion || !allowsFinePointer) {
      return;
    }

    const handlePointerMove = (event: PointerEvent) => {
      pointerX.set(((event.clientX / window.innerWidth) - 0.5) * 28);
      pointerY.set(((event.clientY / window.innerHeight) - 0.5) * 24);
    };

    const resetPointer = () => {
      pointerX.set(0);
      pointerY.set(0);
    };

    window.addEventListener("pointermove", handlePointerMove);
    window.addEventListener("pointerleave", resetPointer);

    return () => {
      window.removeEventListener("pointermove", handlePointerMove);
      window.removeEventListener("pointerleave", resetPointer);
    };
  }, [pointerX, pointerY]);

  return (
    <motion.div
      className="loader-stage"
      initial={{ opacity: 1 }}
      animate={
        isExiting
          ? { opacity: 0, scale: 1.02, filter: "blur(3px)" }
          : { opacity: 1, scale: 1, filter: "blur(0px)" }
      }
      transition={{ duration: 0.64, ease: [0.22, 1, 0.36, 1] }}
    >
      <div className="film-grain" />

      <motion.div className="loader-stage__halo" style={{ x: haloX, y: haloY }} />

      <div className="loader-stage__brand">SHAAN SHOUKATH</div>

      <motion.div
        className="loader-stage__ring-system"
        style={{ x: ringX, y: ringY }}
      >
        <div className="loader-stage__ring-copy">
          <span>PORTFOLIO LOADING</span>
          <span>[MOTION / SYSTEMS / INTERFACE]</span>
        </div>

        <div className="loader-stage__ring-shell">
          {Array.from({ length: 18 }).map((_, index) => (
            <span
              key={`loader-tick-${index}`}
              className="loader-stage__tick"
              style={{ transform: `rotate(${index * 20}deg)` }}
            />
          ))}

          <svg viewBox="0 0 320 320" className="loader-stage__svg" aria-hidden="true">
            <circle
              className="loader-stage__track"
              cx="160"
              cy="160"
              r={loaderRadius}
            />
            <circle
              className="loader-stage__fill"
              cx="160"
              cy="160"
              r={loaderRadius}
              strokeDasharray={loaderCircumference}
              strokeDashoffset={
                loaderCircumference - (progress / 100) * loaderCircumference
              }
            />
            <circle
              className="loader-stage__inner-ring"
              cx="160"
              cy="160"
              r="102"
            />
          </svg>

          <div className="loader-stage__core">
            <span className="loader-stage__progress">
              [{String(progress).padStart(2, "0")}%]
            </span>
            <span className="loader-stage__label">ENTERING THE SITE</span>
          </div>
        </div>
      </motion.div>

      <div className="loader-stage__footer">
        A cinematic portfolio with a single coordinated scroll flow.
      </div>
    </motion.div>
  );
}
