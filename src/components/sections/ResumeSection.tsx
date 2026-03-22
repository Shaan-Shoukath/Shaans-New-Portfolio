"use client";

import { motion } from "framer-motion";
import { SectionWrapper } from "@/components/shared/SectionWrapper";
import { AnimatedHeading } from "@/components/shared/AnimatedHeading";
import { GlassCard } from "@/components/shared/GlassCard";
import {
  Download,
  FileText,
  Briefcase,
  GraduationCap,
  Award,
} from "lucide-react";

const highlights = [
  {
    icon: Briefcase,
    title: "Experience",
    description: "Full-stack development across multiple domains",
  },
  {
    icon: GraduationCap,
    title: "Education",
    description: "Computer Science & Engineering",
  },
  {
    icon: Award,
    title: "Certifications",
    description: "Cloud, DevOps, and system design certifications",
  },
];

export function ResumeSection() {
  return (
    <SectionWrapper id="resume">
      <AnimatedHeading subtitle="Background and professional experience">
        Resume
      </AnimatedHeading>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
        {highlights.map((item, i) => (
          <GlassCard
            key={item.title}
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: i * 0.1 }}
            viewport={{ once: true }}
          >
            <div className="flex items-start gap-4">
              <div className="p-2.5 rounded-xl bg-gradient-to-br from-indigo-500/20 to-violet-500/20 border border-indigo-500/20 shrink-0">
                <item.icon className="w-5 h-5 text-indigo-400" />
              </div>
              <div>
                <h3 className="font-semibold font-[family-name:var(--font-heading)] mb-1">
                  {item.title}
                </h3>
                <p className="text-sm text-muted-foreground">
                  {item.description}
                </p>
              </div>
            </div>
          </GlassCard>
        ))}
      </div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.3 }}
        viewport={{ once: true }}
        className="flex justify-center"
      >
        <a
          href="#"
          className="inline-flex items-center gap-3 px-8 py-4 rounded-xl bg-gradient-to-r from-indigo-500 to-violet-500 text-white font-medium hover:shadow-lg hover:shadow-indigo-500/25 transition-all duration-300 hover:-translate-y-0.5 group"
        >
          <Download className="w-5 h-5 group-hover:animate-bounce" />
          Download Resume
          <FileText className="w-4 h-4 opacity-60" />
        </a>
      </motion.div>
    </SectionWrapper>
  );
}
