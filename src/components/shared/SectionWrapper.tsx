"use client";

import { cn } from "@/lib/utils";
import { motion } from "framer-motion";
import { useScrollAnimation } from "@/hooks/useScrollAnimation";

interface SectionWrapperProps {
  id?: string;
  children: React.ReactNode;
  className?: string;
  fullHeight?: boolean;
}

export function SectionWrapper({
  id,
  children,
  className,
  fullHeight = false,
}: SectionWrapperProps) {
  const { ref } = useScrollAnimation();

  return (
    <motion.section
      id={id}
      ref={ref}
      className={cn(
        "relative w-full px-4 sm:px-6 lg:px-8",
        fullHeight ? "min-h-screen flex items-center" : "py-20 md:py-32",
        className
      )}
      initial={{ opacity: 0 }}
      whileInView={{ opacity: 1 }}
      transition={{ duration: 0.6 }}
      viewport={{ once: true, margin: "-100px" }}
    >
      <div className="mx-auto w-full max-w-7xl">{children}</div>
    </motion.section>
  );
}
