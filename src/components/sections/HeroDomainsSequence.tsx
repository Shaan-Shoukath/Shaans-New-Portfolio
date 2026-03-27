"use client";

import type { CSSProperties } from "react";
import { useEffect, useLayoutEffect, useRef, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { createClient } from "@/lib/supabase/client";
import { getDomainTone } from "@/lib/domain-tones";
import type { About, Domain } from "@/lib/types";

gsap.registerPlugin(ScrollTrigger);

const fallbackAbout: About = {
  id: "fallback-about",
  name: "SHAAN SHOUKATH",
  tagline: "Building digital systems across web, mobile, IoT, UAV and AI.",
  quote: "Designing cinematic interfaces with a systems mindset.",
  profile_image_url: null,
  hero_floating_words: [
    "Creative Direction",
    "Interactive Systems",
    "Product Engineering",
    "Motion Language",
    "AI Integration",
    "Brand Surfaces",
  ],
  updated_at: "",
};

const fallbackDomains: Domain[] = [
  {
    id: "web",
    title: "Web Development",
    icon: "globe",
    description:
      "Crafting high-performance interfaces, robust product systems, and editorial frontends that feel precise on every screen.",
    background_tone: "ember",
    tools: ["Next.js", "React", "TypeScript", "Node.js"],
    order_index: 0,
    created_at: "",
  },
  {
    id: "app",
    title: "App Development",
    icon: "smartphone",
    description:
      "Building polished cross-platform apps with Flutter and React Native, with strong interaction patterns and production-ready architecture.",
    background_tone: "midnight",
    tools: ["Flutter", "React Native"],
    order_index: 1,
    created_at: "",
  },
  {
    id: "uav",
    title: "UAV and Robotics",
    icon: "wifi",
    description:
      "Blending autonomy, real-time data, and experimentation across robotics, aerial systems, and spatial interfaces.",
    background_tone: "graphite",
    tools: ["PX4", "ROS", "Computer Vision", "SLAM"],
    order_index: 2,
    created_at: "",
  },
  {
    id: "ai",
    title: "AI and ML",
    icon: "layers",
    description:
      "Shipping intelligent products that combine applied machine learning, workflow automation, and language-first experiences.",
    background_tone: "plum",
    tools: ["Python", "PyTorch", "LLMs", "Automation"],
    order_index: 3,
    created_at: "",
  },
  {
    id: "iot",
    title: "IoT and Embedded",
    icon: "cpu",
    description:
      "Designing connected hardware pipelines with telemetry, real-time control, and resilient communication between device and cloud.",
    background_tone: "moss",
    tools: ["ESP32", "Raspberry Pi", "MQTT", "Sensors"],
    order_index: 4,
    created_at: "",
  },
];

const ringRadius = 172;
const ringCircumference = 2 * Math.PI * ringRadius;

function normalizeText(value: unknown, fallback = "") {
  if (typeof value === "string") {
    const normalized = value.trim();
    return normalized || fallback;
  }

  if (typeof value === "number") {
    return String(value);
  }

  return fallback;
}

function normalizeTextArray(value: unknown) {
  if (!Array.isArray(value)) {
    return [];
  }

  return value
    .map((item) => normalizeText(item))
    .filter(Boolean);
}

function splitDisplayName(name: unknown) {
  const normalized = normalizeText(name, fallbackAbout.name).replace(/\s+/g, " ");
  const pieces = normalized.split(" ");

  return {
    primary: pieces[0] || "SHAAN",
    secondary: pieces.slice(1).join(" ") || "SHOUKATH",
  };
}

function getFloatingWordStyle(index: number, total: number) {
  const slotCount = Math.max(total, 6);
  const angle = (-88 + (360 / slotCount) * index) * (Math.PI / 180);
  const horizontalRadius = index % 2 === 0 ? 31 : 26;
  const verticalRadius = index % 3 === 0 ? 30 : 23;

  return {
    left: `calc(50% + ${Math.cos(angle) * horizontalRadius}%)`,
    top: `calc(50% + ${Math.sin(angle) * verticalRadius}%)`,
    animationDelay: `${index * 0.42}s`,
    animationDuration: `${7.4 + (index % 4) * 0.8}s`,
  };
}

function normalizeAbout(about: About | null) {
  const nextAbout = about ?? fallbackAbout;
  const floatingWords = normalizeTextArray(nextAbout.hero_floating_words);

  return {
    ...fallbackAbout,
    ...nextAbout,
    name: normalizeText(nextAbout.name, fallbackAbout.name),
    tagline: normalizeText(nextAbout.tagline, fallbackAbout.tagline ?? ""),
    quote: normalizeText(nextAbout.quote, fallbackAbout.quote ?? ""),
    hero_floating_words: floatingWords,
  };
}

function normalizeDomains(domains: Domain[]) {
  if (domains.length === 0) {
    return fallbackDomains;
  }

  return domains
    .map((domain, index) => {
      const fallbackDomain =
        fallbackDomains[Math.min(index, fallbackDomains.length - 1)] ??
        fallbackDomains[0];
      const normalizedTools = normalizeTextArray(domain.tools);

      return {
        ...fallbackDomain,
        ...domain,
        id: normalizeText(domain.id, fallbackDomain.id || `domain-${index + 1}`),
        title:
          normalizeText(domain.title, fallbackDomain.title) || `Domain ${index + 1}`,
        description:
          normalizeText(domain.description) ||
          fallbackDomain.description ||
          "A focused domain with systems-led execution and cinematic presentation.",
        background_tone:
          normalizeText(domain.background_tone, fallbackDomain.background_tone ?? "") ||
          fallbackDomain.background_tone,
        tools: normalizedTools,
        order_index:
          typeof domain.order_index === "number"
            ? domain.order_index
            : fallbackDomain.order_index,
      };
    })
    .sort((left, right) => left.order_index - right.order_index);
}

export function HeroDomainsSequence() {
  const [about, setAbout] = useState<About | null>(null);
  const [domains, setDomains] = useState<Domain[]>([]);
  const [activeIndex, setActiveIndex] = useState(0);
  const supabase = useRef(createClient()).current;
  const sectionRef = useRef<HTMLDivElement>(null);
  const trackRef = useRef<HTMLDivElement>(null);
  const heroRef = useRef<HTMLDivElement>(null);
  const progressRef = useRef<SVGCircleElement>(null);
  const activeIndexRef = useRef(0);

  useEffect(() => {
    let cancelled = false;

    async function fetchContent() {
      const [{ data: aboutData }, { data: domainData }] = await Promise.all([
        supabase.from("about").select("*").limit(1).maybeSingle(),
        supabase.from("domains").select("*").order("order_index", {
          ascending: true,
        }),
      ]);

      if (cancelled) {
        return;
      }

      setAbout(aboutData ?? fallbackAbout);
      setDomains(domainData && domainData.length > 0 ? domainData : fallbackDomains);
    }

    void fetchContent();

    return () => {
      cancelled = true;
    };
  }, [supabase]);

  const displayAbout = normalizeAbout(about);
  const displayDomains = normalizeDomains(domains);
  const totalDomains = displayDomains.length;
  const safeActiveIndex = Math.min(activeIndex, Math.max(totalDomains - 1, 0));
  const activeDomain = displayDomains[safeActiveIndex] ?? fallbackDomains[0];
  const hasNextPreview = safeActiveIndex < totalDomains - 1;
  const nextPreviewIndex = hasNextPreview ? safeActiveIndex + 1 : null;
  const nextPreviewDomain =
    nextPreviewIndex !== null ? displayDomains[nextPreviewIndex] : null;
  const activeTone = getDomainTone(activeDomain.background_tone);
  const floatingWords =
    displayAbout.hero_floating_words.length > 0
      ? displayAbout.hero_floating_words
      : fallbackAbout.hero_floating_words;
  const displayName = splitDisplayName(displayAbout.name);

  useEffect(() => {
    const hero = heroRef.current;
    if (!hero) {
      return;
    }

    const prefersReducedMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)"
    ).matches;
    const allowsFinePointer = window.matchMedia("(pointer: fine)").matches;

    if (prefersReducedMotion || !allowsFinePointer) {
      hero.style.setProperty("--hero-mouse-x", "50%");
      hero.style.setProperty("--hero-mouse-y", "42%");
      return;
    }

    let frameId = 0;
    let currentX = 0.5;
    let currentY = 0.42;
    let targetX = 0.5;
    let targetY = 0.42;

    const render = () => {
      currentX += (targetX - currentX) * 0.08;
      currentY += (targetY - currentY) * 0.08;
      hero.style.setProperty("--hero-mouse-x", `${(currentX * 100).toFixed(2)}%`);
      hero.style.setProperty("--hero-mouse-y", `${(currentY * 100).toFixed(2)}%`);

      if (
        Math.abs(targetX - currentX) > 0.001 ||
        Math.abs(targetY - currentY) > 0.001
      ) {
        frameId = window.requestAnimationFrame(render);
      } else {
        frameId = 0;
      }
    };

    const requestRender = () => {
      if (!frameId) {
        frameId = window.requestAnimationFrame(render);
      }
    };

    const handlePointerMove = (event: PointerEvent) => {
      const rect = hero.getBoundingClientRect();
      targetX = gsap.utils.clamp(0, 1, (event.clientX - rect.left) / rect.width);
      targetY = gsap.utils.clamp(0, 1, (event.clientY - rect.top) / rect.height);
      requestRender();
    };

    const handlePointerLeave = () => {
      targetX = 0.5;
      targetY = 0.42;
      requestRender();
    };

    hero.addEventListener("pointermove", handlePointerMove);
    hero.addEventListener("pointerleave", handlePointerLeave);

    return () => {
      hero.removeEventListener("pointermove", handlePointerMove);
      hero.removeEventListener("pointerleave", handlePointerLeave);
      if (frameId) {
        window.cancelAnimationFrame(frameId);
      }
    };
  }, []);

  useLayoutEffect(() => {
    const section = sectionRef.current;
    const track = trackRef.current;
    const progressRing = progressRef.current;

    if (!section || !track || !progressRing || totalDomains === 0) {
      return;
    }

    const prefersReducedMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)"
    ).matches;
    const handoffDistance = Math.max(window.innerWidth * 0.92, 720);
    const domainStepDistance = Math.max(
      window.innerHeight * (prefersReducedMotion ? 0.6 : 0.82),
      560
    );
    const domainDistance = domainStepDistance * Math.max(totalDomains, 1);
    const totalDistance = handoffDistance + domainDistance;

    activeIndexRef.current = 0;
    setActiveIndex(0);
    section.style.setProperty("--handoff-progress", "0");
    progressRing.style.strokeDashoffset = `${ringCircumference}`;

    const ctx = gsap.context(() => {
      gsap.set(track, { x: 0 });

      const timeline = gsap.timeline({
        scrollTrigger: {
          trigger: section,
          start: "top top",
          end: () => `+=${totalDistance}`,
          pin: true,
          scrub: prefersReducedMotion ? 0.3 : 1,
          anticipatePin: 1,
          invalidateOnRefresh: true,
          onUpdate: (self) => {
            const travelled = self.progress * totalDistance;
            const domainTravelled = gsap.utils.clamp(
              0,
              domainDistance,
              travelled - handoffDistance
            );
            const handoffProgress = gsap.utils.clamp(
              0,
              1,
              travelled / handoffDistance
            );
            const domainProgress = gsap.utils.clamp(
              0,
              1,
              domainTravelled / domainDistance
            );
            const nextIndex =
              totalDomains === 1
                ? 0
                : Math.min(
                    Math.floor(domainTravelled / domainStepDistance + 0.0001),
                    totalDomains - 1
                  );

            section.style.setProperty(
              "--handoff-progress",
              handoffProgress.toFixed(4)
            );

            if (nextIndex !== activeIndexRef.current) {
              activeIndexRef.current = nextIndex;
              setActiveIndex(nextIndex);
            }

            progressRing.style.strokeDashoffset = String(
              ringCircumference - domainProgress * ringCircumference
            );
          },
        },
      });

      timeline
        .to(track, {
          x: () => -window.innerWidth,
          ease: "none",
          duration: handoffDistance,
        })
        .to({}, { duration: domainDistance });
    }, section);

    const refreshId = window.requestAnimationFrame(() => ScrollTrigger.refresh());

    return () => {
      window.cancelAnimationFrame(refreshId);
      ctx.revert();
    };
  }, [totalDomains]);

  return (
    <div
      ref={sectionRef}
      id="hero"
      className="cinematic-sequence"
      style={
        {
          "--active-domain-ring": activeTone.ring,
          "--active-domain-accent": activeTone.accent,
        } as CSSProperties
      }
    >
      <div ref={trackRef} className="cinematic-sequence__track">
        <section ref={heroRef} className="hero-editorial cinema-panel">
          <div className="hero-editorial__background" aria-hidden="true" />
          <div className="hero-editorial__mesh" aria-hidden="true" />

          <div className="hero-editorial__frame">
            <div className="hero-editorial__kicker">
              <span>[SHAAN / PORTFOLIO]</span>
              <span>[2026 EDITION]</span>
            </div>

            <div className="hero-editorial__name-block">
              <div className="hero-editorial__floating-words" aria-hidden="true">
                {floatingWords.map((word, index) => (
                  <span
                    key={`${word}-${index}`}
                    className="hero-editorial__floating-word"
                    style={getFloatingWordStyle(index, floatingWords.length)}
                  >
                    [{word}]
                  </span>
                ))}
              </div>

              <h1 className="hero-editorial__title">
                <span>{displayName.primary}</span>
                <span>{displayName.secondary}</span>
              </h1>
            </div>

            <div className="hero-editorial__meta">
              <p className="hero-editorial__tagline">
                {displayAbout.tagline || fallbackAbout.tagline}
              </p>
            </div>

            <div className="hero-editorial__footer">
              <span>[SCROLL]</span>
              <p>{displayAbout.quote || fallbackAbout.quote}</p>
            </div>
          </div>
        </section>

        <section id="domains" className="domains-stage cinema-panel">
          <div
            className="domains-stage__left"
            style={{ background: activeTone.panelBackground }}
          >
            <div
              className="domains-stage__left-glow"
              style={{ background: activeTone.halo }}
            />

            <div className="domains-stage__ring-copy">
              <span className="domains-stage__eyebrow">ACTIVE DOMAIN</span>
              <span className="domains-stage__counter">
                [{String(safeActiveIndex + 1).padStart(2, "0")} /{" "}
                {String(totalDomains).padStart(2, "0")}]
              </span>
            </div>

            <div className="domains-stage__ring">
              <svg viewBox="0 0 400 400" aria-hidden="true">
                <circle
                  className="domains-stage__ring-track"
                  cx="200"
                  cy="200"
                  r={ringRadius}
                />
                <circle
                  ref={progressRef}
                  className="domains-stage__ring-fill"
                  cx="200"
                  cy="200"
                  r={ringRadius}
                  strokeDasharray={ringCircumference}
                  strokeDashoffset={ringCircumference}
                />
              </svg>

              <div className="domains-stage__ring-center">
                <span className="domains-stage__ring-index">
                  {String(safeActiveIndex + 1).padStart(2, "0")}
                </span>
                <span className="domains-stage__ring-caption">SCROLL</span>
              </div>
            </div>

            <div className="domains-stage__title-block">
              <span className="domains-stage__eyebrow">GUIDING PRINCIPLES</span>
              <h2 className="domains-stage__title">DOMAINS</h2>
            </div>
          </div>

          <div className="domains-stage__right">
            <div className="domains-stage__grid" aria-hidden="true" />

            <AnimatePresence mode="wait">
              <motion.article
                key={activeDomain.id}
                className="domains-stage__card"
                initial={{ opacity: 0, y: 28 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{
                  duration: 0.45,
                  ease: [0.22, 1, 0.36, 1],
                }}
              >
                <span className="domains-stage__card-index">
                  [{String(safeActiveIndex + 1).padStart(2, "0")}]
                </span>
                <h3 className="domains-stage__card-title">{activeDomain.title}</h3>
                <p className="domains-stage__card-description">
                  {activeDomain.description ||
                    fallbackDomains[safeActiveIndex]?.description ||
                    "A focused domain with systems-led execution and cinematic presentation."}
                </p>

                <div className="domains-stage__tool-list">
                  {activeDomain.tools.map((tool) => (
                    <span key={tool} className="domains-stage__tool">
                      {tool}
                    </span>
                  ))}
                </div>
              </motion.article>
            </AnimatePresence>

            {hasNextPreview && nextPreviewDomain && nextPreviewIndex !== null ? (
              <AnimatePresence mode="wait" initial={false}>
                <motion.div
                  key={nextPreviewDomain.id}
                  className="domains-stage__preview"
                  initial={{ opacity: 0, y: 18 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -12 }}
                  transition={{
                    duration: 0.35,
                    ease: [0.22, 1, 0.36, 1],
                  }}
                >
                  <div className="domains-stage__preview-item">
                    <span>{String(nextPreviewIndex + 1).padStart(2, "0")}</span>
                    <span>{nextPreviewDomain.title}</span>
                  </div>
                </motion.div>
              </AnimatePresence>
            ) : null}
          </div>
        </section>
      </div>
    </div>
  );
}
