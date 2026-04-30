"use client";

import { motion } from "framer-motion";
import { SectionWrapper } from "@/components/shared/SectionWrapper";
import { AnimatedHeading } from "@/components/shared/AnimatedHeading";
import { GlassCard } from "@/components/shared/GlassCard";
import {
  FileText,
  Briefcase,
  GraduationCap,
  Award,
  ArrowDownToLine,
} from "lucide-react";

const highlights = [
  {
    icon: Briefcase,
    title: "Experience",
    description: "Full-stack development across multiple domains",
    accent: "from-indigo-500 to-cyan-400",
    accentColor: "text-indigo-400",
  },
  {
    icon: GraduationCap,
    title: "Education",
    description: "Computer Science & Engineering",
    accent: "from-violet-500 to-fuchsia-400",
    accentColor: "text-violet-400",
  },
  {
    icon: Award,
    title: "Certifications",
    description: "Cloud, DevOps, and system design certifications",
    accent: "from-amber-400 to-orange-500",
    accentColor: "text-amber-400",
  },
];

export function ResumeSection() {
  return (
    <SectionWrapper id="resume">
      <AnimatedHeading subtitle="Background and professional experience">
        Resume
      </AnimatedHeading>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
        {highlights.map((item, i) => (
          <GlassCard
            key={item.title}
            initial={{ opacity: 0, y: 40, scale: 0.95 }}
            whileInView={{ opacity: 1, y: 0, scale: 1 }}
            transition={{ duration: 0.5, delay: i * 0.12 }}
            viewport={{ once: true }}
            whileHover={{ y: -6, scale: 1.02 }}
            className="group relative overflow-hidden"
          >
            {/* Top gradient accent */}
            <div
              className={`absolute top-0 left-0 right-0 h-[2px] bg-gradient-to-r ${item.accent} opacity-60 group-hover:opacity-100 transition-opacity`}
            />

            {/* Corner bloom */}
            <div
              className={`pointer-events-none absolute -top-12 -right-12 w-32 h-32 rounded-full bg-gradient-to-br ${item.accent} opacity-0 group-hover:opacity-[0.07] blur-3xl transition-opacity duration-500`}
            />

            <div className="flex items-start gap-4">
              <div
                className={`p-3 rounded-xl border border-white/10 group-hover:border-white/20 transition-all duration-300`}
                style={{
                  background: `linear-gradient(135deg, rgba(255,255,255,0.06), rgba(255,255,255,0.02))`,
                }}
              >
                <item.icon
                  className={`w-6 h-6 ${item.accentColor} group-hover:scale-110 transition-transform duration-300`}
                />
              </div>
              <div>
                <h3 className="font-semibold font-[family-name:var(--font-heading)] mb-1 group-hover:text-white transition-colors">
                  {item.title}
                </h3>
                <p className="text-sm text-muted-foreground leading-relaxed">
                  {item.description}
                </p>
              </div>
            </div>
          </GlassCard>
        ))}
      </div>

      {/* Download CTA */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.4 }}
        viewport={{ once: true }}
        className="flex justify-center"
      >
        <a
          href="#"
          className="relative inline-flex items-center gap-3 px-10 py-4 rounded-xl bg-gradient-to-r from-indigo-500 to-violet-500 text-white font-medium transition-all duration-300 hover:-translate-y-1 hover:shadow-2xl hover:shadow-indigo-500/30 group overflow-hidden"
        >
          {/* Shine sweep */}
          <div className="absolute inset-0 -translate-x-full group-hover:translate-x-full transition-transform duration-700 bg-gradient-to-r from-transparent via-white/15 to-transparent" />
          <ArrowDownToLine className="w-5 h-5 group-hover:animate-bounce relative z-10" />
          <span className="relative z-10">Download Resume</span>
          <FileText className="w-4 h-4 opacity-50 relative z-10" />
        </a>
      </motion.div>
    </SectionWrapper>
  );
}
