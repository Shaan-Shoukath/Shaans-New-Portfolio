"use client";

import { cn } from "@/lib/utils";
import { motion } from "framer-motion";

interface AnimatedHeadingProps {
  children: React.ReactNode;
  className?: string;
  gradient?: boolean;
  as?: "h1" | "h2" | "h3";
  subtitle?: string;
}

export function AnimatedHeading({
  children,
  className,
  gradient = true,
  as: Tag = "h2",
  subtitle,
}: AnimatedHeadingProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, ease: "easeOut" }}
      viewport={{ once: true }}
      className="mb-12 md:mb-16"
    >
      <Tag
        className={cn(
          "text-3xl md:text-4xl lg:text-5xl font-bold tracking-tight",
          "font-[family-name:var(--font-heading)]",
          gradient && "gradient-text",
          className
        )}
      >
        {children}
      </Tag>
      {subtitle && (
        <motion.p
          initial={{ opacity: 0, y: 15 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.15 }}
          viewport={{ once: true }}
          className="mt-4 text-lg text-muted-foreground max-w-2xl"
        >
          {subtitle}
        </motion.p>
      )}
    </motion.div>
  );
}
