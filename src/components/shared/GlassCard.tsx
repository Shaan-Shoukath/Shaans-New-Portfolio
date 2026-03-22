"use client";

import { cn } from "@/lib/utils";
import { motion, type HTMLMotionProps } from "framer-motion";
import { forwardRef } from "react";

interface GlassCardProps extends HTMLMotionProps<"div"> {
  hover?: boolean;
  glow?: boolean;
}

const GlassCard = forwardRef<HTMLDivElement, GlassCardProps>(
  ({ className, children, hover = true, glow = false, ...props }, ref) => {
    return (
      <motion.div
        ref={ref}
        className={cn(
          "glass rounded-xl p-6",
          hover && "transition-all duration-300 hover:bg-white/[0.08] hover:border-white/20",
          glow && "glow",
          className
        )}
        {...props}
      >
        {children}
      </motion.div>
    );
  }
);

GlassCard.displayName = "GlassCard";
export { GlassCard };
