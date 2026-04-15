"use client";

import React, {
  type CSSProperties,
  useCallback,
  useEffect,
  useLayoutEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { JourneyModal } from "@/components/journey/JourneyModal";
import { getNodePositions, getPointOnSVGPath } from "@/components/journey/JourneyPath";
import { createClient } from "@/lib/supabase/client";
import type { Experience } from "@/lib/types";

gsap.registerPlugin(ScrollTrigger);

const JOURNEY_TONES = [
  {
    accent: "rgba(236, 145, 94, 0.85)",
    dim: "rgba(236, 145, 94, 0.28)",
    glow: "rgba(196, 74, 49, 0.12)",
    ring: "rgba(255, 223, 204, 0.72)",
    bg: "radial-gradient(circle at 20% 50%, rgba(196, 74, 49, 0.18), transparent 65%)",
  },
  {
    accent: "rgba(144, 182, 255, 0.85)",
    dim: "rgba(144, 182, 255, 0.28)",
    glow: "rgba(44, 82, 140, 0.12)",
    ring: "rgba(214, 228, 255, 0.72)",
    bg: "radial-gradient(circle at 20% 50%, rgba(44, 82, 140, 0.18), transparent 65%)",
  },
  {
    accent: "rgba(171, 214, 154, 0.85)",
    dim: "rgba(171, 214, 154, 0.28)",
    glow: "rgba(65, 96, 52, 0.12)",
    ring: "rgba(222, 241, 209, 0.72)",
    bg: "radial-gradient(circle at 20% 50%, rgba(65, 96, 52, 0.18), transparent 65%)",
  },
  {
    accent: "rgba(220, 220, 220, 0.85)",
    dim: "rgba(220, 220, 220, 0.22)",
    glow: "rgba(140, 140, 140, 0.10)",
    ring: "rgba(245, 245, 245, 0.72)",
    bg: "radial-gradient(circle at 20% 50%, rgba(120, 120, 120, 0.12), transparent 65%)",
  },
  {
    accent: "rgba(235, 163, 217, 0.85)",
    dim: "rgba(235, 163, 217, 0.28)",
    glow: "rgba(103, 51, 88, 0.12)",
    ring: "rgba(248, 220, 240, 0.72)",
    bg: "radial-gradient(circle at 20% 50%, rgba(103, 51, 88, 0.18), transparent 65%)",
  },
];

const EXPERIENCE_TYPES: Experience["type"][] = ["professional", "education", "freelance"];
const COMMUNITY_TYPES: Experience["type"][] = ["social"];

const fallbackExperience: Experience[] = [
  {
    id: "journey-1",
    title: "The Foundation",
    company: "Self-Taught Era",
    description:
      "Started with HTML, CSS, and curiosity. Built first websites, discovered the joy of making things work on screen.",
    image_url: null,
    type: "education",
    start_date: "2020",
    end_date: "2021",
    tags: ["HTML", "CSS", "JavaScript", "Curiosity"],
    published: true,
    order_index: 0,
    created_at: "",
  },
  {
    id: "journey-2",
    title: "Systems Thinking",
    company: "Engineering Deep-Dive",
    description:
      "Dove into full-stack development, embedded systems, and UAV control. Learned to think in systems.",
    image_url: null,
    type: "professional",
    start_date: "2022",
    end_date: "2023",
    tags: ["React", "Node.js", "PX4", "IoT"],
    published: true,
    order_index: 1,
    created_at: "",
  },
  {
    id: "journey-3",
    title: "Creative Engineering",
    company: "Present & Beyond",
    description:
      "Merging design and engineering. Building cinematic interfaces, autonomous systems, and AI-powered products.",
    image_url: null,
    type: "freelance",
    start_date: "2024",
    end_date: null,
    tags: ["Next.js", "GSAP", "AI/ML", "Drones"],
    published: true,
    order_index: 2,
    created_at: "",
  },
];

const fallbackCommunity: Experience[] = [
  {
    id: "community-1",
    title: "Open Source Contributor",
    company: "Community",
    description: "Contributing to open source projects and mentoring developers in the community.",
    image_url: null,
    type: "social",
    start_date: "2022",
    end_date: null,
    tags: ["Open Source", "Mentoring", "Community"],
    published: true,
    order_index: 10,
    created_at: "",
  },
];

interface JourneyAnchor {
  x: number;
  y: number;
  angle: number;
}

const HEADER_OFFSET = 160; // px — shifts SVG path center below 50% to clear the header
const DEFAULT_VIEWPORT_WIDTH = 1440;
const DEFAULT_VIEWPORT_HEIGHT = 900;
const MIN_TRACK_PANELS = 2.5; // tighter node spacing reduces dead-zone in center

function getPathHeight(viewportHeight: number) {
  return Math.min(480, Math.max(280, viewportHeight * 0.44));
}

function getCardWidth(viewportWidth: number) {
  if (viewportWidth < 480) return 240;
  if (viewportWidth < 640) return 260;
  if (viewportWidth < 960) return 300;
  if (viewportWidth < 1280) return 320;
  return 340;
}

function getConnectorLength(viewportWidth: number, viewportHeight: number) {
  if (viewportWidth < 480) return 36;
  if (viewportWidth < 768) return 48;
  if (viewportHeight < 700) return 44; // short laptop screens
  if (viewportHeight < 900) return 60;
  return 68;
}

function getTrackWidth(nodeCount: number, viewportWidth: number, cardWidth: number) {
  const minNodeSpacing = cardWidth + (viewportWidth < 768 ? 90 : 130);
  return Math.max(viewportWidth * MIN_TRACK_PANELS, minNodeSpacing * (nodeCount + 1));
}

function getFallbackAnchor(progress: number, width: number, pathHeight: number): JourneyAnchor {
  return {
    x: progress * width,
    y: pathHeight * 0.5,
    angle: 0,
  };
}

export function JourneySection() {
  // Low-frequency progress state — only updated when a node threshold is crossed.
  // This drives isActive on node cards without re-rendering on every scroll tick.
  const [activeProgress, setActiveProgress] = useState(0);
  const activeProgressRef = useRef(0);
  const [selected, setSelected] = useState<{ entry: Experience; displayIndex: number } | null>(null);

  const [nodeAnchors, setNodeAnchors] = useState<JourneyAnchor[]>([]);
  const [viewportWidth, setViewportWidth] = useState(() =>
    typeof window !== "undefined" ? window.innerWidth : DEFAULT_VIEWPORT_WIDTH
  );
  const [viewportHeight, setViewportHeight] = useState(() =>
    typeof window !== "undefined" ? window.innerHeight : DEFAULT_VIEWPORT_HEIGHT
  );

  const sectionRef = useRef<HTMLDivElement>(null);
  const trackRef = useRef<HTMLDivElement>(null);
  const pathSvgRef = useRef<SVGSVGElement>(null);
  // These refs drive progress bar / label / SVG via direct DOM mutations — no re-renders.
  const progressRef = useRef(0);
  const progressBarRef = useRef<HTMLDivElement>(null);
  const progressLabelRef = useRef<HTMLSpanElement>(null);
  const supabase = useRef(createClient()).current;

  const [experienceEntries, setExperienceEntries] = useState<Experience[]>([]);
  const [communityEntries, setCommunityEntries] = useState<Experience[]>([]);

  useEffect(() => {
    let cancelled = false;

    async function fetchEntries() {
      const { data } = await supabase
        .from("experiences")
        .select("*")
        .eq("published", true)
        .order("order_index", { ascending: true });

      if (cancelled) return;

      if (data && data.length > 0) {
        const exp = data.filter((e: Experience) => EXPERIENCE_TYPES.includes(e.type));
        const comm = data.filter((e: Experience) => COMMUNITY_TYPES.includes(e.type));
        setExperienceEntries(exp.length > 0 ? exp : fallbackExperience);
        setCommunityEntries(comm.length > 0 ? comm : fallbackCommunity);
      } else {
        setExperienceEntries(fallbackExperience);
        setCommunityEntries(fallbackCommunity);
      }
    }

    void fetchEntries();

    return () => {
      cancelled = true;
    };
  }, [supabase]);

  // Combine: experience first, then community — this is the render order on the path
  const displayEntries = [...experienceEntries, ...communityEntries];
  // Threshold where community section begins (progress fraction)
  const communityStartIndex = experienceEntries.length;
  const communityStartProgress =
    displayEntries.length > 0 ? communityStartIndex / (displayEntries.length + 1) : 0.85;

  useEffect(() => {
    if (typeof window === "undefined") return undefined;

    const handleResize = () => {
      setViewportWidth(window.innerWidth);
      setViewportHeight(window.innerHeight);
    };

    handleResize();
    window.addEventListener("resize", handleResize);

    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []);


  const nodeCount = displayEntries.length;
  // Memoize so the array reference is stable — prevents infinite loops
  // in callbacks/effects that depend on nodePositions.
  const nodePositions = useMemo(() => getNodePositions(nodeCount), [nodeCount]);
  const pathHeight = getPathHeight(viewportHeight);
  const cardWidth = getCardWidth(viewportWidth);
  const connectorLength = getConnectorLength(viewportWidth, viewportHeight);
  const pathWidth = getTrackWidth(nodeCount, viewportWidth, cardWidth);
  const fallbackNodeAnchors = useMemo(
    () => nodePositions.map((t) => getFallbackAnchor(t, pathWidth, pathHeight)),
    [nodePositions, pathWidth, pathHeight]
  );

  const getActivePathElement = useCallback(() => {
    return (
      pathSvgRef.current?.querySelector<SVGPathElement>('path[data-journey-path="active"]') ??
      null
    );
  }, []);

  const syncAnchors = useCallback(() => {
    const pathEl = getActivePathElement();
    if (!pathEl) return false;

    setNodeAnchors(nodePositions.map((t) => getPointOnSVGPath(pathEl, t)));

    return true;
  }, [getActivePathElement, nodePositions]);

  const handleProgressUpdate = useCallback(
    (prog: number) => {
      // Update progress bar DOM directly (no React re-render needed)
      progressRef.current = prog;
      if (progressBarRef.current) {
        progressBarRef.current.style.width = `${prog * 100}%`;
      }
      if (progressLabelRef.current) {
        progressLabelRef.current.textContent = `${Math.round(prog * 100)}%`;
      }

      // Only trigger React re-render when a node threshold is crossed.
      const nearestNode = nodePositions.find(
        (t, i) => Math.abs(prog - t) < 0.015 || (i === 0 && prog < nodePositions[0]! + 0.015)
      );
      const threshold = nearestNode !== undefined ? 0.02 : 0.03;
      if (Math.abs(prog - activeProgressRef.current) > threshold) {
        activeProgressRef.current = prog;
        setActiveProgress(prog);
      }
    },
    [nodePositions]
  );

  useLayoutEffect(() => {
    let rafId = 0;
    let attempts = 0;
    const MAX_ATTEMPTS = 60; // give up after ~1 second of rAF retries

    const sync = () => {
      if (syncAnchors()) return;
      if (attempts++ < MAX_ATTEMPTS) {
        rafId = window.requestAnimationFrame(sync);
      }
    };

    rafId = window.requestAnimationFrame(sync);

    return () => {
      window.cancelAnimationFrame(rafId);
    };
  }, [pathWidth, syncAnchors]);

  useLayoutEffect(() => {
    const section = sectionRef.current;
    const track = trackRef.current;
    if (!section || !track || nodeCount === 0) return;

    const scrollDistance = Math.max(pathWidth - viewportWidth, 1);

    const ctx = gsap.context(() => {
      gsap.set(track, { x: 0 });

      ScrollTrigger.create({
        trigger: section,
        start: "top top",
        end: () => `+=${scrollDistance}`,
        pin: true,
        scrub: 1,
        anticipatePin: 1,
        invalidateOnRefresh: true,
        onRefresh: () => {
          void window.requestAnimationFrame(() => {
            syncAnchors();
          });
        },
        onUpdate: (self) => {
          track.style.transform = `translateX(${-self.progress * scrollDistance}px)`;
          handleProgressUpdate(self.progress);
          // Fade section out in the last 10% of scroll so it disappears before unpin
          if (self.progress > 0.9) {
            section.style.opacity = String(Math.max(0, 1 - (self.progress - 0.9) / 0.1));
          } else {
            section.style.opacity = "1";
          }
        },
        onLeave: () => {
          section.style.opacity = "0";
        },
        onEnterBack: () => {
          section.style.opacity = "1";
        },
      });
    }, section);

    const refreshId = window.requestAnimationFrame(() =>
      window.requestAnimationFrame(() => ScrollTrigger.refresh())
    );

    return () => {
      window.cancelAnimationFrame(refreshId);
      ctx.revert();
    };
  }, [handleProgressUpdate, nodeCount, pathWidth, syncAnchors, viewportWidth]);

  return (
    <section ref={sectionRef} id="journey" className="journey-stage">
      <div className="journey-stage__bg" />
      <div className="journey-stage__grid" aria-hidden="true" />

      <div className="journey-stage__header">
        <span className="journey-stage__eyebrow">[JOURNEY]</span>
        <div className="journey-stage__title-wrapper">
          <h2
            className={`journey-stage__title ${
              activeProgress >= 0.85
                ? "journey-stage__title--exit"
                : "journey-stage__title--active"
            }`}
          >
            EXPERIENCE
          </h2>
          <h2
            className={`journey-stage__title ${
              activeProgress >= communityStartProgress
                ? "journey-stage__title--active"
                : "journey-stage__title--hidden"
            }`}
          >
            COMMUNITY AND VOLUNTEERING
          </h2>
        </div>
        <div className="journey-stage__subtitle">{"Scroll to explore ->"}</div>
      </div>

      <div ref={trackRef} className="journey-track" style={{ width: pathWidth, willChange: "transform" }}>
        <svg
          ref={pathSvgRef}
          className="journey-track__canvas"
          viewBox={`0 0 ${pathWidth} ${pathHeight}`}
          preserveAspectRatio="xMinYMid meet"
          style={{ height: pathHeight }}
        >
          <JourneyPathInline
            progressRef={progressRef}
            width={pathWidth}
            height={pathHeight}
            nodeCount={nodeCount}
            toneAccents={JOURNEY_TONES.map((tone) => ({
              accent: tone.accent,
              dim: tone.dim,
            }))}
          />

        </svg>

        <div className="journey-track__nodes">
          {displayEntries.map((entry, index) => {
            const t = nodePositions[index] ?? 0.5;
            const rawAnchor =
              nodeAnchors[index] ?? fallbackNodeAnchors[index] ?? getFallbackAnchor(t, pathWidth, pathHeight);
            // Clamp X so cards never clip the left/right viewport edges
            const EDGE_PAD = viewportWidth < 768 ? 16 : 32;
            const halfCard = cardWidth / 2;
            const clampedX = Math.max(halfCard + EDGE_PAD, Math.min(pathWidth - halfCard - EDGE_PAD, rawAnchor.x));
            const anchor = { ...rawAnchor, x: clampedX };
            const isAbove = index % 2 === 1; // first card goes below to avoid EXPERIENCE header overlap
            const isActive = activeProgress >= t - 0.03;
            const tone = JOURNEY_TONES[index % JOURNEY_TONES.length]!;
            const isCommunity = COMMUNITY_TYPES.includes(entry.type);

            const wrapperStyle = {
              left: `${anchor.x}px`,
              // Shift path center down by HEADER_OFFSET/2 to clear the header text
              // The CSS canvas top is calc(50% + 80px) so anchor.y is relative to that
              top: `calc(50% + 80px - ${pathHeight / 2}px + ${anchor.y}px)`,
              zIndex: isActive ? 16 : 8 + index,
              "--node-accent": tone.accent,
              "--node-dim": tone.dim,
              "--node-glow": tone.glow,
              "--node-ring": tone.ring,
              "--node-bg": tone.bg,
              "--node-card-width": `${cardWidth}px`,
              "--node-connector-length": `${connectorLength}px`,
              willChange: "transform",
            } as CSSProperties;

            return (
              <div
                key={entry.id}
                className={`journey-node-wrapper journey-node-wrapper--${isAbove ? "above" : "below"} ${isActive ? "journey-node-wrapper--active" : ""}`}
                style={wrapperStyle}
              >
                <div className="journey-node-shell">
                  <div
                    className={`journey-node-connector ${isAbove ? "journey-node-connector--above" : "journey-node-connector--below"}`}
                  />

                  <div
                    className="journey-node-body"
                    onClick={() => setSelected({ entry, displayIndex: index + 1 })}
                  >
                    <div className={`journey-node journey-node--clickable ${isActive ? "journey-node--active" : ""}`}>
                      <div className="journey-node__phase">
                        <span className="journey-node__phase-index">
                          [{String(index + 1).padStart(2, "0")}]
                        </span>
                        <span className="journey-node__phase-date">
                          {entry.start_date}
                          {entry.end_date ? ` - ${entry.end_date}` : " - Present"}
                        </span>
                      </div>

                      {entry.image_url && (
                        <div className="journey-node__image">
                          <img
                            src={entry.image_url}
                            alt={entry.title}
                            loading="lazy"
                            draggable={false}
                          />
                        </div>
                      )}

                      <h3 className="journey-node__title">{entry.title}</h3>
                      <p className="journey-node__company">{entry.company}</p>

                      {entry.description && (
                        <p className="journey-node__description">{entry.description}</p>
                      )}

                      {entry.tags && entry.tags.length > 0 && (
                        <div className="journey-node__tags">
                          {entry.tags.slice(0, 4).map((tag) => (
                            <span key={tag} className="journey-node__tag">
                              {tag}
                            </span>
                          ))}
                        </div>
                      )}

                      <div className="journey-node__type">
                        {isCommunity ? (
                          <span style={{ color: "var(--node-accent)", fontSize: "0.6rem", letterSpacing: "0.12em", textTransform: "uppercase", opacity: 0.85 }}>
                            ◆ Community
                          </span>
                        ) : (
                          entry.type
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        <div className="journey-particles" aria-hidden="true">
          {Array.from({ length: 24 }).map((_, index) => (
            <div
              key={index}
              className="journey-particle"
              style={{
                left: `${(index / 24) * 100}%`,
                top: `${15 + Math.sin(index * 1.7) * 35 + (index % 3) * 5}%`,
                animationDelay: `${index * 0.3}s`,
                animationDuration: `${4 + (index % 4) * 1.8}s`,
                width: `${1.5 + (index % 3) * 0.5}px`,
                height: `${1.5 + (index % 3) * 0.5}px`,
              }}
            />
          ))}
        </div>
      </div>

      <div className="journey-progress">
        <div className="journey-progress__bar">
          {/* Updated via direct DOM ref — no React re-render on every scroll tick */}
          <div ref={progressBarRef} className="journey-progress__fill" style={{ width: "0%" }} />
        </div>
        <span ref={progressLabelRef} className="journey-progress__label">0%</span>
      </div>

      <JourneyModal
        entry={selected?.entry ?? null}
        displayIndex={selected?.displayIndex ?? 1}
        onClose={() => setSelected(null)}
      />
    </section>
  );
}

function JourneyPathInline({
  progressRef,
  width,
  height,
  nodeCount,
  toneAccents,
}: {
  progressRef: React.RefObject<number>;
  width: number;
  height: number;
  nodeCount: number;
  toneAccents: { accent: string; dim: string }[];
}) {
  const pathRef = useRef<SVGPathElement>(null);
  const glowPathRef = useRef<SVGPathElement>(null);
  const totalLengthRef = useRef(0);

  const pathD = generateJourneyPath(width, height, nodeCount);
  // Node positions are stable for a given nodeCount
  const nodePositions = useMemo(() => getNodePositions(nodeCount), [nodeCount]);

  // Measure path length AND compute node dot positions in one effect
  // to ensure nodeDots is populated immediately after the path is ready.
  const [nodeDots, setNodeDots] = useState<{ x: number; y: number }[]>([]);
  useEffect(() => {
    if (!pathRef.current) return;

    const len = pathRef.current.getTotalLength();
    totalLengthRef.current = len;

    // Set initial dasharray
    pathRef.current.setAttribute("stroke-dasharray", String(len || 1));
    pathRef.current.setAttribute("stroke-dashoffset", String(len));
    if (glowPathRef.current) {
      glowPathRef.current.setAttribute("stroke-dasharray", String(len || 1));
      glowPathRef.current.setAttribute("stroke-dashoffset", String(len));
    }

    // Compute node dots right after measuring
    if (len > 0) {
      setNodeDots(
        nodePositions.map((t) => {
          const pt = pathRef.current!.getPointAtLength(t * len);
          return { x: pt.x, y: pt.y };
        })
      );
    }
  }, [pathD, nodePositions]);

  // Drive the SVG dash reveal directly via rAF — no React state or re-renders
  useEffect(() => {
    let rafId = 0;
    // Track last written progress to skip redundant setAttribute calls
    let lastProg = -1;

    const tick = () => {
      const len = totalLengthRef.current;
      if (len > 0 && pathRef.current) {
        const prog = progressRef.current ?? 0;
        // Guard: only write to DOM when progress actually changed
        if (prog !== lastProg) {
          lastProg = prog;
          const offset = len - prog * len;
          pathRef.current.setAttribute("stroke-dashoffset", String(offset));
          if (glowPathRef.current) {
            glowPathRef.current.setAttribute("stroke-dashoffset", String(offset));
          }
        }
      }
      rafId = requestAnimationFrame(tick);
    };

    rafId = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(rafId);
  // progressRef is a stable ref object; no need to re-run when it changes.
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <>
      <defs>
        <filter id="journey-glow" x="-20%" y="-20%" width="140%" height="140%">
          <feGaussianBlur in="SourceGraphic" stdDeviation="8" result="blur" />
          <feColorMatrix
            in="blur"
            type="matrix"
            values="0 0 0 0 0.86  0 0 0 0 0.15  0 0 0 0 0.15  0 0 0 0.5 0"
          />
          <feMerge>
            <feMergeNode />
            <feMergeNode in="SourceGraphic" />
          </feMerge>
        </filter>

        <linearGradient id="journey-grad" x1="0%" y1="0%" x2="100%" y2="0%">
          <stop offset="0%" stopColor="rgba(255, 255, 255, 0.92)" />
          <stop offset="50%" stopColor="rgba(255, 255, 255, 0.72)" />
          <stop offset="100%" stopColor="rgba(255, 255, 255, 0.42)" />
        </linearGradient>
      </defs>

      <path d={pathD} fill="none" stroke="rgba(255, 255, 255, 0.08)" strokeWidth="2" />

      <path
        d={pathD}
        fill="none"
        stroke="rgba(255, 255, 255, 0.10)"
        strokeWidth="1"
        strokeDasharray="8 20"
      />

      {/* Glow path — dashoffset updated by rAF loop */}
      <path
        ref={glowPathRef}
        d={pathD}
        fill="none"
        stroke="rgba(255, 255, 255, 0.35)"
        strokeWidth="8"
        strokeLinecap="round"
        strokeDasharray="1"
        strokeDashoffset="1"
        filter="url(#journey-glow)"
      />

      {/* Active path — dashoffset updated by rAF loop */}
      <path
        ref={pathRef}
        data-journey-path="active"
        d={pathD}
        fill="none"
        stroke="url(#journey-grad)"
        strokeWidth="2.5"
        strokeLinecap="round"
        strokeDasharray="1"
        strokeDashoffset="1"
      />

      {nodeDots.map((point, index) => {
        const tone = toneAccents[index % toneAccents.length] ?? toneAccents[0]!;

        return (
          <g key={index}>
            <circle
              cx={point.x}
              cy={point.y}
              r={8}
              fill="none"
              stroke={tone.dim}
              strokeWidth={1}
            />
            <circle
              cx={point.x}
              cy={point.y}
              r={3}
              fill={tone.accent}
            />
          </g>
        );
      })}
    </>
  );
}

function generateJourneyPath(width: number, height: number, nodeCount: number): string {
  const midY = height * 0.5;
  const amplitude = height * 0.16; // reduced from 0.22 — shallower wave keeps cards in viewport
  const segments = nodeCount + 1;
  const segWidth = width / segments;

  let d = `M ${segWidth * 0.1} ${midY}`;

  for (let i = 0; i < segments; i += 1) {
    const startX = segWidth * 0.1 + i * segWidth * 0.9;
    const x1 = startX + segWidth * 0.3;
    const x2 = startX + segWidth * 0.6;
    const x3 = startX + segWidth * 0.9;
    const direction = i % 2 === 0 ? -1 : 1;
    const cy1 = midY + direction * amplitude;
    const cy2 = midY + direction * amplitude * 0.6;

    d += ` C ${x1} ${cy1}, ${x2} ${cy2}, ${x3} ${midY}`;
  }

  return d;
}
