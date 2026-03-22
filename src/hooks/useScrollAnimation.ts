"use client";

import { useScroll, useTransform, type MotionValue } from "framer-motion";
import { useRef } from "react";

interface ScrollAnimationOptions {
  offset?: [string, string];
}

export function useScrollAnimation(options: ScrollAnimationOptions = {}) {
  const ref = useRef<HTMLDivElement>(null);
  const { offset = ["start end", "end start"] } = options;

  const { scrollYProgress } = useScroll({
    target: ref,
    offset: offset as unknown as [string, string],
  });

  return { ref, scrollYProgress };
}

export function useParallax(value: MotionValue<number>, distance: number) {
  return useTransform(value, [0, 1], [-distance, distance]);
}
