"use client";

import { useEffect, useState, useRef } from "react";
import { motion } from "framer-motion";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { createClient } from "@/lib/supabase/client";
import type { Domain } from "@/lib/types";

gsap.registerPlugin(ScrollTrigger);

const fallbackDomains = [
  { id: "1", title: "Web Development", icon: "globe", description: "Crafting high-performance web applications with modern frameworks, server-side rendering, and seamless user experiences across all devices.", background_tone: "ember", tools: ["Next.js", "React", "TypeScript", "Node.js"], order_index: 0, created_at: "" },
  { id: "2", title: "App Development", icon: "smartphone", description: "Building polished cross-platform apps with Flutter and React Native, with strong interaction patterns and production-ready architecture.", background_tone: "midnight", tools: ["Flutter", "React Native"], order_index: 1, created_at: "" },
  { id: "4", title: "UAV and Robotics", icon: "wifi", description: "Developing autonomous systems with advanced computer vision, path planning algorithms, and real-time control architectures.", background_tone: "graphite", tools: ["ROS", "PX4", "Computer Vision", "SLAM"], order_index: 2, created_at: "" },
  { id: "5", title: "AI and ML", icon: "layers", description: "Implementing intelligent systems leveraging deep learning, natural language processing, and large language model integration.", background_tone: "plum", tools: ["Python", "TensorFlow", "PyTorch", "LLMs"], order_index: 3, created_at: "" },
  { id: "3", title: "IoT and Embedded", icon: "cpu", description: "Engineering connected hardware systems with real-time telemetry, edge computing, and industrial-grade communication protocols.", background_tone: "moss", tools: ["Arduino", "Raspberry Pi", "MQTT", "ESP32"], order_index: 4, created_at: "" },
];

const domainDescriptions: Record<string, string> = {
  "Web Development": "Crafting high-performance web applications with modern frameworks, server-side rendering, and seamless user experiences across all devices.",
  "App Development": "Building polished cross-platform apps with Flutter and React Native, with strong interaction patterns and production-ready architecture.",
  "UAV and Robotics": "Developing autonomous systems with advanced computer vision, path planning algorithms, and real-time control architectures.",
  "AI and ML": "Implementing intelligent systems leveraging deep learning, natural language processing, and large language model integration.",
  "IoT and Embedded": "Engineering connected hardware systems with real-time telemetry, edge computing, and industrial-grade communication protocols.",
};

export function DomainsSection() {
  const [domains, setDomains] = useState<Domain[]>([]);
  const [activeIndex, setActiveIndex] = useState(0);
  const supabase = createClient();
  const containerRef = useRef<HTMLDivElement>(null);
  const rightContentRef = useRef<HTMLDivElement>(null);
  const progressRef = useRef<SVGCircleElement>(null);

  useEffect(() => {
    async function fetchDomains() {
      const { data } = await supabase
        .from("domains")
        .select("*")
        .order("order_index", { ascending: true });
      if (data && data.length > 0) {
        setDomains(data);
      } else {
        setDomains(fallbackDomains);
      }
    }
    fetchDomains();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const displayDomains = domains.length > 0 ? domains : fallbackDomains;
  const total = displayDomains.length;

  // Circle dimensions
  const circleRadius = 180;
  const circumference = 2 * Math.PI * circleRadius;

  // GSAP scroll-driven vertical scroll inside right panel
  useEffect(() => {
    const container = containerRef.current;
    const rightContent = rightContentRef.current;
    if (!container || !rightContent || total === 0) return;

    // Create scroll trigger that pins the split layout and scrolls the right content
    const scrollHeight = total * window.innerHeight * 0.6;

    const tl = gsap.timeline({
      scrollTrigger: {
        trigger: container,
        pin: true,
        scrub: 1,
        start: "top top",
        end: () => "+=" + scrollHeight,
        invalidateOnRefresh: true,
        onUpdate: (self) => {
          const progress = self.progress;
          const newIndex = Math.min(
            Math.floor(progress * total),
            total - 1
          );
          setActiveIndex(newIndex);

          // Update progress circle
          if (progressRef.current) {
            const offset = circumference - (progress * circumference);
            progressRef.current.style.strokeDashoffset = String(offset);
          }
        },
      },
    });

    // Scroll the right content panel
    tl.to(rightContent, {
      y: () => -(rightContent.scrollHeight - window.innerHeight),
      ease: "none",
    });

    return () => {
      tl.kill();
      ScrollTrigger.getAll()
        .filter((t) => t.trigger === container)
        .forEach((t) => t.kill());
    };
  }, [total, circumference]);

  return (
    <div ref={containerRef} className="designation-split" id="domains">
      {/* Vertical divider */}
      <div className="designation-divider" />

      {/* ─── LEFT HALF ─── */}
      <div className="designation-left">
        <div className="designation-left__bg" />

        {/* Progress Circle */}
        <motion.div
          className="progress-circle"
          initial={{ scale: 0.8, opacity: 0 }}
          whileInView={{ scale: 1, opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
        >
          {/* SVG circle */}
          <svg viewBox="0 0 400 400">
            <circle
              className="progress-circle__track"
              cx="200"
              cy="200"
              r={circleRadius}
            />
            <circle
              ref={progressRef}
              className="progress-circle__fill"
              cx="200"
              cy="200"
              r={circleRadius}
              strokeDasharray={circumference}
              strokeDashoffset={circumference}
            />
          </svg>

          {/* Inner content */}
          <div className="progress-circle__inner">
            {/* Tick line at top */}
            <div className="absolute top-[14%] left-1/2 -translate-x-1/2 w-px h-4 bg-white/20" />

            {/* Counter */}
            <span className="progress-circle__counter">
              [{String(activeIndex + 1).padStart(2, "0")}]&nbsp;&nbsp;&nbsp;/ [{String(total).padStart(2, "0")}]
            </span>

            {/* Scroll label */}
            <span className="progress-circle__scroll">SCROLL</span>

            {/* Bottom tick marks */}
            <div className="absolute bottom-[18%] left-[25%] w-[6px] h-px bg-white/15 -rotate-45" />
            <div className="absolute bottom-[22%] right-[25%] w-[6px] h-px bg-white/15 rotate-45" />
          </div>
        </motion.div>

        {/* Section title at bottom-left */}
        <div className="designation-title">
          <div className="designation-title__sub">GUIDING PRINCIPLES</div>
          <div className="designation-title__main font-heading">
            MY<br />DOMAINS
          </div>
        </div>
      </div>

      {/* ─── RIGHT HALF ─── */}
      <div className="designation-right">
        <div className="designation-right__bg" />

        <div ref={rightContentRef} className="will-change-transform">
          {displayDomains.map((domain, i) => (
            <DesignationItem
              key={domain.id}
              domain={domain}
              index={i}
              total={total}
              isActive={i === activeIndex}
            />
          ))}
        </div>
      </div>
    </div>
  );
}

function DesignationItem({
  domain,
  index,
  total,
  isActive,
}: {
  domain: Domain;
  index: number;
  total: number;
  isActive: boolean;
}) {
  const description =
    domainDescriptions[domain.title] ||
    `Expertise in ${domain.title.toLowerCase()} with proficiency across ${domain.tools.join(", ")}.`;

  return (
    <div
      className="designation-item"
      style={{ minHeight: `${100 / Math.min(total, 3)}vh` }}
    >
      {/* Index */}
      <div className="designation-item__index">
        [{String(index + 1).padStart(2, "0")}]
      </div>

      {/* Title */}
      <h3
        className="designation-item__title font-heading"
        style={{
          opacity: isActive ? 1 : 0.4,
          transition: "opacity 0.5s ease",
        }}
      >
        {domain.title}
      </h3>

      {/* Description */}
      <p
        className="designation-item__desc"
        style={{
          opacity: isActive ? 1 : 0.2,
          transition: "opacity 0.5s ease",
        }}
      >
        {description}
      </p>

      {/* Tools */}
      <div
        className="designation-item__tools"
        style={{
          opacity: isActive ? 1 : 0.3,
          transition: "opacity 0.5s ease",
        }}
      >
        {domain.tools.map((tool) => (
          <span key={tool} className="designation-item__tool">
            {tool}
          </span>
        ))}
      </div>
    </div>
  );
}
