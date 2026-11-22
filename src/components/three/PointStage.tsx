"use client";

import dynamic from "next/dynamic";
import { useEffect, useState } from "react";
import { emitShape } from "./shape-events";
import type { ShapeName } from "./stations";

// three.js (~150 kB gz) ships in its own chunk, fetched only after the page is idle.
const Workshop = dynamic(() => import("./Workshop"), { ssr: false });

function canRunWebGL() {
  try {
    const nav = navigator as Navigator & { connection?: { saveData?: boolean } };
    if (nav.connection?.saveData) return false;
    const canvas = document.createElement("canvas");
    return Boolean(canvas.getContext("webgl2") || canvas.getContext("webgl"));
  } catch {
    return false;
  }
}

/**
 * Sticky canvas behind the hero + domains. Elements marked with
 * `data-shape` / `data-accent` drive the morph as they cross mid-screen.
 */
export function PointStage() {
  const [mount, setMount] = useState(false);

  useEffect(() => {
    if (!canRunWebGL()) return;
    const idle =
      window.requestIdleCallback ?? ((cb: () => void) => window.setTimeout(cb, 300));
    const cancel = window.cancelIdleCallback ?? window.clearTimeout;
    const id = idle(() => setMount(true), { timeout: 1500 });
    return () => cancel(id);
  }, []);

  useEffect(() => {
    if (!mount) return;
    const targets = Array.from(
      document.querySelectorAll<HTMLElement>("[data-shape]")
    );
    const io = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (!entry.isIntersecting) continue;
          const el = entry.target as HTMLElement;
          emitShape({
            shape: el.dataset.shape as ShapeName,
            accent: el.dataset.accent || "#e11d2a",
          });
        }
      },
      { rootMargin: "-45% 0px -45% 0px" }
    );
    targets.forEach((t) => io.observe(t));
    return () => io.disconnect();
  }, [mount]);

  return <div className="point-stage">{mount && <Workshop />}</div>;
}
