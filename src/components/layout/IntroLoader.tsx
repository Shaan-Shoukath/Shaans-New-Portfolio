"use client";

import { useEffect, useRef, useState } from "react";
import { MiniShaan } from "@/components/mini-shaan/MiniShaan";
import { INTRO_DONE } from "@/components/motion/MotionRuntime";

const KEY = "ss-intro-seen";

/**
 * First-visit intro: Mini Shaan runs along a progress line, then the curtain
 * lifts. Once per session, capped at ~1.6s, skipped under reduced motion.
 * The page underneath is fully server-rendered, so crawlers never wait on it.
 * A tiny inline script (in layout) sets `html.intro-skip` before paint on
 * repeat visits so the overlay never flashes.
 */
export function IntroLoader() {
  const [phase, setPhase] = useState<"run" | "lift" | "done">("run");
  const [pct, setPct] = useState(0);
  const raf = useRef(0);

  useEffect(() => {
    const root = document.documentElement;
    if (root.classList.contains("intro-skip")) {
      setPhase("done");
      return;
    }
    try {
      sessionStorage.setItem(KEY, "1");
    } catch {}
    root.classList.add("intro-running");
    const start = performance.now();
    const DURATION = 1500;
    const tick = (now: number) => {
      const t = Math.min((now - start) / DURATION, 1);
      // Ease-out so it sprints, then settles at 100.
      setPct(Math.round((1 - Math.pow(1 - t, 3)) * 100));
      if (t < 1) raf.current = requestAnimationFrame(tick);
      else {
        setPhase("lift");
        // Hero choreography starts as the curtain begins to lift.
        window.dispatchEvent(new Event(INTRO_DONE));
        window.setTimeout(() => {
          setPhase("done");
          root.classList.remove("intro-running");
          root.classList.add("intro-done");
        }, 900);
      }
    };
    raf.current = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf.current);
  }, []);

  if (phase === "done") return null;

  return (
    <div className={`intro${phase === "lift" ? " is-lifting" : ""}`} aria-hidden="true">
      <div className="intro__inner">
        <div className="intro__track">
          <div className="intro__runner" style={{ left: `${pct}%` }}>
            <MiniShaan state={phase === "lift" ? "wave" : "run-right"} size={96} />
          </div>
          <div className="intro__line">
            <span style={{ transform: `scaleX(${pct / 100})` }} />
          </div>
        </div>
        <div className="intro__meta">
          <span>Shaan Shoukath</span>
          <span className="intro__pct">{String(pct).padStart(3, "0")}</span>
        </div>
      </div>
    </div>
  );
}

// Runs before paint: marks repeat visits (no loader) and, when motion is welcome,
// adds `js-motion` so the hero title can start hidden for its reveal.
export const INTRO_SKIP_SCRIPT = `try{var d=document.documentElement,r=matchMedia("(prefers-reduced-motion: reduce)").matches;if(sessionStorage.getItem("${KEY}")||r)d.classList.add("intro-skip");if(!r)d.classList.add("js-motion")}catch(e){}`;
