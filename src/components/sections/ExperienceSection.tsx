"use client";

import { useEffect, useState, useRef } from "react";
import { motion, useInView } from "framer-motion";
import { createClient } from "@/lib/supabase/client";
import type { Experience } from "@/lib/types";

export function ExperienceSection() {
  const [experiences, setExperiences] = useState<Experience[]>([]);
  const supabase = createClient();

  useEffect(() => {
    async function fetchExperiences() {
      const { data } = await supabase
        .from("experiences")
        .select("*")
        .eq("published", true)
        .order("start_date", { ascending: false });
      if (data) setExperiences(data);
    }
    fetchExperiences();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <section id="experience" className="relative py-32 min-h-screen">
      {/* Background */}
      <div className="absolute inset-0 bg-[#050505]" />
      <div className="absolute inset-0 bg-gradient-to-b from-red-950/[0.02] via-transparent to-red-950/[0.02]" />

      {/* Section header */}
      <div className="relative z-10 max-w-6xl mx-auto px-6 mb-24">
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="text-center"
        >
          <span className="text-[11px] tracking-[0.4em] text-red-600/60 uppercase font-mono block mb-4">
            [EXPERIENCE]
          </span>
          <h2 className="text-5xl md:text-7xl font-bold font-[family-name:var(--font-heading)] tracking-tight mb-4">
            <span className="text-white">Journey</span>
          </h2>
          <div className="w-12 h-[1px] bg-red-600/40 mx-auto" />
        </motion.div>
      </div>

      {/* Timeline */}
      <div className="relative z-10 max-w-4xl mx-auto px-6">
        {/* Central timeline line */}
        <div className="absolute left-6 md:left-1/2 top-0 bottom-0 w-[1px] bg-gradient-to-b from-transparent via-white/[0.08] to-transparent md:-translate-x-[0.5px]" />

        {experiences.map((exp, i) => (
          <ExperienceCard key={exp.id} experience={exp} index={i} />
        ))}

        {experiences.length === 0 && (
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            className="text-center py-20"
          >
            <p className="text-white/20 text-sm">
              Experience entries will appear here. Add them from the admin panel.
            </p>
          </motion.div>
        )}
      </div>
    </section>
  );
}

function ExperienceCard({
  experience,
  index,
}: {
  experience: Experience;
  index: number;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true, amount: 0.3 });
  const isLeft = index % 2 === 0;

  return (
    <div
      ref={ref}
      className={`relative flex items-start gap-8 mb-20 ${
        isLeft ? "md:flex-row" : "md:flex-row-reverse"
      } flex-row`}
    >
      {/* Timeline dot */}
      <motion.div
        className="absolute left-6 md:left-1/2 -translate-x-1/2 w-3 h-3 rounded-full border border-red-600/40 bg-[#050505] z-10 mt-1"
        initial={{ scale: 0 }}
        animate={isInView ? { scale: 1 } : { scale: 0 }}
        transition={{ duration: 0.4, delay: 0.2 }}
      >
        <div className="absolute inset-1 rounded-full bg-red-600/60" />
      </motion.div>

      {/* Content */}
      <motion.div
        className={`ml-14 md:ml-0 md:w-[calc(50%-2rem)] ${
          isLeft ? "md:pr-8 md:text-right" : "md:pl-8 md:text-left"
        }`}
        initial={{
          opacity: 0,
          x: isLeft ? -40 : 40,
        }}
        animate={
          isInView
            ? { opacity: 1, x: 0 }
            : { opacity: 0, x: isLeft ? -40 : 40 }
        }
        transition={{ duration: 0.7, delay: 0.1 }}
      >
        {/* Date */}
        <span className="text-[10px] tracking-[0.3em] text-red-600/50 uppercase font-mono">
          {experience.start_date}
          {experience.end_date ? ` — ${experience.end_date}` : " — Present"}
        </span>

        {/* Type badge */}
        <div className={`mt-2 mb-3 ${isLeft ? "md:flex md:justify-end" : ""}`}>
          <span className="inline-block px-3 py-1 rounded-full text-[9px] tracking-[0.2em] uppercase glass text-white/30 border-white/[0.06]">
            {experience.type}
          </span>
        </div>

        {/* Title & Company */}
        <h3 className="text-xl md:text-2xl font-bold font-[family-name:var(--font-heading)] text-white mb-1 tracking-tight">
          {experience.title}
        </h3>
        <p className="text-sm text-white/40 mb-3 font-[family-name:var(--font-heading)]">
          {experience.company}
        </p>

        {/* Description */}
        {experience.description && (
          <p className="text-sm text-white/25 leading-relaxed">
            {experience.description}
          </p>
        )}

        {/* Tags */}
        {experience.tags && experience.tags.length > 0 && (
          <div className={`flex flex-wrap gap-2 mt-4 ${isLeft ? "md:justify-end" : ""}`}>
            {experience.tags.map((tag) => (
              <span
                key={tag}
                className="text-[9px] tracking-[0.1em] text-white/20 uppercase"
              >
                {tag}
              </span>
            ))}
          </div>
        )}
      </motion.div>

      {/* Spacer for the other side */}
      <div className="hidden md:block md:w-[calc(50%-2rem)]" />
    </div>
  );
}
