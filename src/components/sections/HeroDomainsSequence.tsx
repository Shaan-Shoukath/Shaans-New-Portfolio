"use client";

import type { CSSProperties } from "react";
import { useEffect, useLayoutEffect, useRef, useState } from "react";
import { AnimatePresence, motion, useMotionValue, useSpring, useTransform } from "framer-motion";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { createClient } from "@/lib/supabase/client";
import { getDomainTone } from "@/lib/domain-tones";
import type { About, Domain, HeroImage } from "@/lib/types";

gsap.registerPlugin(ScrollTrigger);

const fallbackAbout: About = {
  id: "fallback-about",
  name: "SHAAN SHOUKATH",
  tagline: "BUILDING\nCOOL STUFF..",
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

/* ── Utility helpers ── */

function normalizeText(value: unknown, fallback = "") {
  if (typeof value === "string") {
    const normalized = value.trim();
    return normalized || fallback;
  }
  if (typeof value === "number") return String(value);
  return fallback;
}

function normalizeTextArray(value: unknown) {
  if (!Array.isArray(value)) return [];
  return value.map((item) => normalizeText(item)).filter(Boolean);
}

function splitDisplayName(name: unknown) {
  const normalized = normalizeText(name, fallbackAbout.name).replace(/\s+/g, " ");
  const pieces = normalized.split(" ");
  return {
    primary: pieces[0] || "SHAAN",
    secondary: pieces.slice(1).join(" ") || "SHOUKATH",
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
  if (domains.length === 0) return fallbackDomains;
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

/* ── Dulcedo-Style Centered Portrait Carousel ── */

function HeroPortraitCarousel({ images }: { images: HeroImage[] }) {
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    if (images.length <= 1) return;
    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % images.length);
    }, 3000);
    return () => clearInterval(interval);
  }, [images.length]);

  if (images.length === 0) return null;

  return (
    <div className="dulcedo-portrait" aria-hidden="true">
      <AnimatePresence mode="wait">
        <motion.div
          key={images[currentIndex].id}
          className="dulcedo-portrait__slide"
          initial={{ opacity: 0, scale: 1.04 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.97 }}
          transition={{ duration: 0.9, ease: [0.22, 1, 0.36, 1] }}
        >
          <img
            src={images[currentIndex].image_url}
            alt={images[currentIndex].alt_text || "Portfolio image"}
            draggable={false}
          />
        </motion.div>
      </AnimatePresence>
    </div>
  );
}

/* ── Mouse-Reactive Elliptical Rings (Dulcedo-style) ── */

function DulcedoRings() {
  const pointerX = useMotionValue(0);
  const pointerY = useMotionValue(0);
  const springX = useSpring(pointerX, { stiffness: 35, damping: 20, mass: 1.0 });
  const springY = useSpring(pointerY, { stiffness: 35, damping: 20, mass: 1.0 });

  // Each ring has its own parallax multiplier — creates organic randomness on mouse move
  const ring1X = useTransform(springX, (v) => v * -1.8);
  const ring1Y = useTransform(springY, (v) => v * -1.4);
  const ring2X = useTransform(springX, (v) => v * -1.05);
  const ring2Y = useTransform(springY, (v) => v * -0.8);
  const ring3X = useTransform(springX, (v) => v * -0.4);
  const ring3Y = useTransform(springY, (v) => v * -0.28);

  useEffect(() => {
    const prefersReducedMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)"
    ).matches;
    if (prefersReducedMotion) return;

    const handlePointerMove = (event: PointerEvent) => {
      pointerX.set(((event.clientX / window.innerWidth) - 0.5) * 50);
      pointerY.set(((event.clientY / window.innerHeight) - 0.5) * 40);
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
    <div className="dulcedo-rings" aria-hidden="true">
      {/* Burst ring — expands from a tiny point then fades, revealing the page */}
      <motion.div
        className="dulcedo-ring dulcedo-ring--burst"
        initial={{ scale: 0.04, opacity: 0 }}
        animate={{ scale: [0.04, 1.3, 1.3], opacity: [0, 0.65, 0] }}
        transition={{ duration: 2.5, times: [0, 0.46, 1], ease: "easeOut" }}
      />

      {/* Ring 1 — outermost wide landscape ellipse, strongest parallax */}
      <motion.div
        className="dulcedo-ring dulcedo-ring--1"
        style={{ x: ring1X, y: ring1Y, rotate: 6 }}
        initial={{ scale: 0, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ duration: 2.0, delay: 0.15, ease: [0.22, 1, 0.36, 1] }}
      />

      {/* Ring 2 — tall portrait ellipse, counter-rotated */}
      <motion.div
        className="dulcedo-ring dulcedo-ring--2"
        style={{ x: ring2X, y: ring2Y, rotate: -14 }}
        initial={{ scale: 0, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ duration: 1.8, delay: 0.35, ease: [0.22, 1, 0.36, 1] }}
      />

      {/* Ring 3 — innermost narrow ellipse, barely moves */}
      <motion.div
        className="dulcedo-ring dulcedo-ring--3"
        style={{ x: ring3X, y: ring3Y, rotate: 28 }}
        initial={{ scale: 0, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ duration: 1.5, delay: 0.55, ease: [0.22, 1, 0.36, 1] }}
      />
    </div>
  );
}

/* ══════════════════════════════════════════════════════════════════════════════
   MAIN COMPONENT — preserves the horizontal scroll + vh/vw lock
   ══════════════════════════════════════════════════════════════════════════════ */

export function HeroDomainsSequence() {
  const [about, setAbout] = useState<About | null>(null);
  const [domains, setDomains] = useState<Domain[]>([]);
  const [heroImages, setHeroImages] = useState<HeroImage[]>([]);
  const [activeIndex, setActiveIndex] = useState(0);
  const supabase = useRef(createClient()).current;
  const sectionRef = useRef<HTMLDivElement>(null);
  const trackRef = useRef<HTMLDivElement>(null);
  const heroRef = useRef<HTMLDivElement>(null);
  const progressRef = useRef<SVGCircleElement>(null);
  const activeIndexRef = useRef(0);

  /* ── Data fetch ── */
  useEffect(() => {
    let cancelled = false;

    async function fetchContent() {
      const [{ data: aboutData }, { data: domainData }, { data: heroImageData }] =
        await Promise.all([
          supabase.from("about").select("*").limit(1).maybeSingle(),
          supabase
            .from("domains")
            .select("*")
            .order("order_index", { ascending: true }),
          supabase
            .from("hero_images")
            .select("*")
            .eq("active", true)
            .order("order_index", { ascending: true }),
        ]);

      if (cancelled) return;

      setAbout(aboutData ?? fallbackAbout);
      setDomains(domainData && domainData.length > 0 ? domainData : fallbackDomains);
      setHeroImages(heroImageData ?? []);
    }

    void fetchContent();
    return () => {
      cancelled = true;
    };
  }, [supabase]);

  /* ── Derived display values ── */
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
  const displayName = splitDisplayName(displayAbout.name);

  /* ── GSAP Horizontal Scroll — PRESERVED ── */
  useLayoutEffect(() => {
    const section = sectionRef.current;
    const track = trackRef.current;
    const progressRing = progressRef.current;

    if (!section || !track || !progressRing || totalDomains === 0) return;

    const prefersReducedMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)"
    ).matches;
    const handoffDistance = Math.max(window.innerWidth * 0.55, 500);
    const domainStepDistance = Math.max(
      window.innerHeight * (prefersReducedMotion ? 0.35 : 0.5),
      280
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

  /* ═══════════════════════ RENDER ═══════════════════════ */

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
        {/* ────────── HERO PANEL (Dulcedo-style) ────────── */}
        <section ref={heroRef} className="hero-dulcedo-panel cinema-panel">
          {/* Film grain overlay */}
          <div className="film-grain" />

          {/* Ambient background glow */}
          <div className="dulcedo-hero-glow" aria-hidden="true" />

          {/* Mouse-reactive concentric rings */}
          <DulcedoRings />

          {/* Center stage: flanking text + portrait carousel */}
          <div className="dulcedo-center-stage">
            {/* Left flanking text */}
            <motion.span
              className="dulcedo-flank dulcedo-flank--left"
              initial={{ opacity: 0, x: -24 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 1, delay: 0.6, ease: [0.22, 1, 0.36, 1] }}
            >
              {displayName.primary}
            </motion.span>

            {/* Portrait carousel — centered */}
            {heroImages.length > 0 ? (
              <HeroPortraitCarousel images={heroImages} />
            ) : (
              /* Placeholder portrait when no images */
              <motion.div
                className="dulcedo-portrait dulcedo-portrait--placeholder"
                initial={{ opacity: 0, y: 30, scale: 0.95 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                transition={{ duration: 1.2, delay: 0.3, ease: [0.22, 1, 0.36, 1] }}
              >
                <div className="dulcedo-portrait__empty">
                  <div className="dulcedo-portrait__pattern" />
                  <span className="dulcedo-portrait__initial">
                    {displayName.primary.charAt(0)}
                  </span>
                  <div className="dulcedo-portrait__accent-line" />
                </div>
              </motion.div>
            )}

            {/* Right flanking text */}
            <motion.span
              className="dulcedo-flank dulcedo-flank--right"
              initial={{ opacity: 0, x: 24 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 1, delay: 0.6, ease: [0.22, 1, 0.36, 1] }}
            >
              {displayName.secondary}
            </motion.span>
          </div>

          {/* Bottom tagline — Dulcedo-style bold text */}
          <motion.div
            className="dulcedo-tagline"
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1.2, delay: 0.8, ease: [0.22, 1, 0.36, 1] }}
          >
            <h2>
              {(displayAbout.tagline || fallbackAbout.tagline || "").split("\n").map((line, i) => (
                <span key={i} style={{ display: "block" }}>{line}</span>
              ))}
            </h2>
          </motion.div>

          {/* Scroll indicator — mouse icon */}
          <motion.div
            className="dulcedo-scroll-hint"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1.6, duration: 0.9 }}
          >
            <div className="dulcedo-scroll-hint__mouse">
              <motion.div
                className="dulcedo-scroll-hint__wheel"
                animate={{ y: [0, 14, 0], opacity: [1, 0.25, 1] }}
                transition={{ duration: 1.8, repeat: Infinity, ease: "easeInOut" }}
              />
            </div>
            <motion.span
              className="dulcedo-scroll-hint__label"
              animate={{ opacity: [0.45, 0.85, 0.45] }}
              transition={{ duration: 2.4, repeat: Infinity, ease: "easeInOut" }}
            >
              scroll
            </motion.span>
          </motion.div>
        </section>

        {/* ────────── DOMAINS PANEL (100vw × 100vh) ────────── */}
        <section id="domains" className="domains-stage cinema-panel">
          <div className="domains-stage__left">
            {/* Crossfade background gradient */}
            <AnimatePresence initial={false}>
              <motion.div
                key={`bg-${activeDomain.id}`}
                className="domains-stage__left-bg"
                style={{ background: activeTone.panelBackground }}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.55, ease: [0.22, 1, 0.36, 1] }}
              />
            </AnimatePresence>
            {/* Crossfade halo glow */}
            <AnimatePresence initial={false}>
              <motion.div
                key={`halo-${activeDomain.id}`}
                className="domains-stage__left-glow"
                style={{ background: activeTone.halo }}
                initial={{ opacity: 0 }}
                animate={{ opacity: 0.9 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.55, ease: [0.22, 1, 0.36, 1] }}
              />
            </AnimatePresence>

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
