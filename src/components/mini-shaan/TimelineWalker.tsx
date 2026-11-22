"use client";

import { useEffect, useRef, useState } from "react";
import { MiniShaan, type MiniShaanState } from "./MiniShaan";

/**
 * Mini Shaan walks the timeline rail: he's sticky inside the rail, runs while
 * the page scrolls (direction-aware), idles when you stop, and jumps for joy
 * when he reaches the end of the section.
 */
export function TimelineWalker({ size = 96 }: { size?: number }) {
  const ref = useRef<HTMLDivElement>(null);
  const [state, setState] = useState<MiniShaanState>("wave");

  useEffect(() => {
    const el = ref.current;
    const rail = el?.parentElement;
    if (!el || !rail) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      setState("idle");
      return;
    }

    let lastY = window.scrollY;
    let stopTimer = 0;
    let active = false;
    let atEnd = false;
    let ticking = false;

    const update = () => {
      ticking = false;
      if (!active) return;
      const y = window.scrollY;
      const dy = y - lastY;
      lastY = y;
      // Sticky has stopped once the walker sits at the bottom of the rail.
      const railBox = rail.getBoundingClientRect();
      const box = el.getBoundingClientRect();
      const reachedEnd = railBox.bottom - box.bottom < 4;
      if (reachedEnd) {
        if (!atEnd) {
          setState("jump");
          window.clearTimeout(stopTimer);
          stopTimer = window.setTimeout(() => setState("wave"), 1100);
        }
        atEnd = true;
        return;
      }
      atEnd = false;
      if (Math.abs(dy) < 1) return;
      setState(dy > 0 ? "run-right" : "run-left");
      window.clearTimeout(stopTimer);
      stopTimer = window.setTimeout(() => {
        if (!atEnd) setState("idle");
      }, 220);
    };

    const onScroll = () => {
      if (!ticking) {
        ticking = true;
        requestAnimationFrame(update);
      }
    };

    const io = new IntersectionObserver(([entry]) => {
      active = entry.isIntersecting;
      if (!active) setState("wave");
    });
    io.observe(rail);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => {
      io.disconnect();
      window.removeEventListener("scroll", onScroll);
      window.clearTimeout(stopTimer);
    };
  }, []);

  return (
    <div ref={ref} className="timeline-walker">
      <MiniShaan state={state} size={size} />
    </div>
  );
}
