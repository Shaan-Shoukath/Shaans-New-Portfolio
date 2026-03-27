"use client";

import { useEffect, useState, useRef } from "react";
import { motion, useInView } from "framer-motion";
import { createClient } from "@/lib/supabase/client";
import type { Domain } from "@/lib/types";

const fallbackDomains = [
  { id: "1", title: "Web Development", icon: "globe", tools: ["Next.js", "React", "TypeScript", "Node.js"], order_index: 0, created_at: "" },
  { id: "2", title: "Mobile Apps", icon: "smartphone", tools: ["React Native", "Flutter", "Swift", "Kotlin"], order_index: 1, created_at: "" },
  { id: "3", title: "IoT / Embedded", icon: "cpu", tools: ["Arduino", "Raspberry Pi", "MQTT", "ESP32"], order_index: 2, created_at: "" },
  { id: "4", title: "UAV / Robotics", icon: "wifi", tools: ["ROS", "PX4", "Computer Vision", "SLAM"], order_index: 3, created_at: "" },
  { id: "5", title: "AI / ML", icon: "layers", tools: ["Python", "TensorFlow", "PyTorch", "LLMs"], order_index: 4, created_at: "" },
];

export function DomainsSection() {
  const [domains, setDomains] = useState<Domain[]>([]);
  const supabase = createClient();

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

  return (
    <>
      {displayDomains.map((domain, i) => (
        <DomainPanel
          key={domain.id}
          domain={domain}
          index={i}
          total={displayDomains.length}
        />
      ))}
    </>
  );
}

function DomainPanel({
  domain,
  index,
  total,
}: {
  domain: Domain;
  index: number;
  total: number;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { amount: 0.5 });

  return (
    <div
      ref={ref}
      className="cinema-panel flex items-center justify-center relative"
    >
      {/* Background gradient based on scroll */}
      <div className="absolute inset-0 bg-[#050505]" />
      
      {/* Subtle red wash on alternate panels */}
      {index % 2 === 0 && (
        <div className="absolute inset-0 bg-gradient-to-br from-red-950/[0.04] to-transparent" />
      )}

      {/* Grid pattern */}
      <div
        className="absolute inset-0 opacity-[0.02]"
        style={{
          backgroundImage: `radial-gradient(rgba(255,255,255,0.3) 1px, transparent 1px)`,
          backgroundSize: "40px 40px",
        }}
      />

      {/* Section index - left side */}
      <motion.div
        className="absolute left-8 md:left-16 top-1/2 -translate-y-1/2 hidden md:flex flex-col items-center gap-4"
        initial={{ opacity: 0, x: -30 }}
        animate={isInView ? { opacity: 1, x: 0 } : { opacity: 0, x: -30 }}
        transition={{ duration: 0.6 }}
      >
        <span className="text-[11px] tracking-[0.3em] text-red-600/70 font-mono">
          [{String(index + 1).padStart(2, "0")}]
        </span>
        <div className="w-[1px] h-20 bg-gradient-to-b from-red-600/30 to-transparent" />
        <span className="text-[9px] tracking-[0.2em] text-white/20 font-mono rotate-90 origin-center whitespace-nowrap">
          DOMAIN
        </span>
      </motion.div>

      {/* Section counter - right side */}
      <motion.div
        className="absolute right-8 md:right-16 top-1/2 -translate-y-1/2 hidden md:block"
        initial={{ opacity: 0, x: 30 }}
        animate={isInView ? { opacity: 1, x: 0 } : { opacity: 0, x: 30 }}
        transition={{ duration: 0.6, delay: 0.2 }}
      >
        <div className="text-right">
          <span className="text-4xl font-bold font-[family-name:var(--font-heading)] text-white/10">
            {String(index + 1).padStart(2, "0")}
          </span>
          <span className="text-lg text-white/5 font-[family-name:var(--font-heading)]">
            /{String(total).padStart(2, "0")}
          </span>
        </div>
      </motion.div>

      {/* Center content */}
      <div className="relative z-10 text-center max-w-3xl mx-auto px-6">
        {/* Title */}
        <motion.h2
          className="text-5xl sm:text-6xl md:text-7xl lg:text-8xl font-bold font-[family-name:var(--font-heading)] mb-8 leading-[0.95] tracking-tight"
          initial={{ opacity: 0, y: 60, scale: 1.05 }}
          animate={
            isInView
              ? { opacity: 1, y: 0, scale: 1 }
              : { opacity: 0, y: 60, scale: 1.05 }
          }
          transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
        >
          {domain.title.split(" ").map((word, wi) => (
            <span key={wi}>
              {wi === 0 ? (
                <span className="text-white">{word}</span>
              ) : (
                <span className="text-white/40"> {word}</span>
              )}
            </span>
          ))}
        </motion.h2>

        {/* Divider */}
        <motion.div
          className="w-16 h-[1px] bg-red-600/50 mx-auto mb-8"
          initial={{ scaleX: 0 }}
          animate={isInView ? { scaleX: 1 } : { scaleX: 0 }}
          transition={{ duration: 0.6, delay: 0.3 }}
        />

        {/* Tools - glass pills */}
        <motion.div
          className="flex flex-wrap justify-center gap-3"
          initial={{ opacity: 0, y: 20 }}
          animate={
            isInView
              ? { opacity: 1, y: 0 }
              : { opacity: 0, y: 20 }
          }
          transition={{ duration: 0.6, delay: 0.5 }}
        >
          {domain.tools.map((tool, ti) => (
            <motion.span
              key={tool}
              className="px-4 py-2 rounded-full text-[11px] tracking-[0.15em] uppercase glass border-white/[0.06] text-white/50 hover:text-white hover:border-red-600/20 transition-all duration-300 cursor-default"
              initial={{ opacity: 0, y: 10 }}
              animate={
                isInView
                  ? { opacity: 1, y: 0 }
                  : { opacity: 0, y: 10 }
              }
              transition={{ duration: 0.4, delay: 0.6 + ti * 0.08 }}
            >
              {tool}
            </motion.span>
          ))}
        </motion.div>
      </div>

      {/* Bottom edge line */}
      <div className="absolute bottom-0 left-0 right-0 h-[1px] bg-gradient-to-r from-transparent via-white/[0.05] to-transparent" />
    </div>
  );
}
