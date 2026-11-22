"use client";

import { useEffect, useRef, useState, type CSSProperties } from "react";
import { emitShape } from "@/components/three/shape-events";
import { shapeForDomain } from "@/components/three/stations";
import { getDomainTone } from "@/lib/domain-tones";
import type { Domain } from "@/lib/types";

const SHAPE_ACCENT: Record<string, string> = {
  ember: "#e11d2a",
  midnight: "#6f9cff",
  moss: "#8fcf7a",
  graphite: "#ef4444",
  plum: "#e58fd0",
};

/**
 * Pinned scrollytelling: the section is tall, its content sticks, and scroll
 * progress picks the active domain. The active domain drives the 3D morph.
 * Every domain's copy is in the HTML; inactive ones are only dimmed/hidden visually.
 */
export function DomainsStory({ domains }: { domains: Domain[] }) {
  const ref = useRef<HTMLElement>(null);
  const [active, setActive] = useState(0);
  const [inView, setInView] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    let raf = 0;
    const update = () => {
      raf = 0;
      const r = el.getBoundingClientRect();
      const travel = r.height - window.innerHeight;
      const p = travel > 0 ? Math.min(Math.max(-r.top / travel, 0), 0.9999) : 0;
      setActive(Math.floor(p * domains.length));
      setInView(r.top < window.innerHeight * 0.5 && r.bottom > window.innerHeight * 0.5);
    };
    const onScroll = () => {
      if (!raf) raf = requestAnimationFrame(update);
    };
    update();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
    };
  }, [domains.length]);

  useEffect(() => {
    if (!inView) return;
    const d = domains[active];
    if (!d) return;
    emitShape({
      shape: shapeForDomain(d.title),
      accent: SHAPE_ACCENT[d.background_tone ?? "ember"] ?? "#e11d2a",
    });
  }, [active, inView, domains]);

  return (
    <section
      ref={ref}
      id="domains"
      className="story"
      aria-labelledby="domains-title"
      style={{ "--count": domains.length } as CSSProperties}
    >
      <div className="story__pin">
        <div className="story__inner">
          <h2 id="domains-title" className="story__label">
            What I build
          </h2>
          <ol className="story__list">
            {domains.map((d, i) => (
              <li
                key={d.id}
                className={`story__item${i === active ? " is-active" : ""}`}
                style={{ "--tone": getDomainTone(d.background_tone).accent } as CSSProperties}
              >
                <h3 className="story__title">{d.title}</h3>
                <div className="story__detail">
                  {d.description && <p className="story__text">{d.description}</p>}
                  <ul className="tag-list" aria-label={`${d.title} tools`}>
                    {d.tools.map((t) => (
                      <li key={t} className="tag">
                        {t}
                      </li>
                    ))}
                  </ul>
                </div>
              </li>
            ))}
          </ol>
          <div className="story__progress" aria-hidden="true">
            {domains.map((d, i) => (
              <span key={d.id} className={i <= active ? "is-on" : undefined} />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
