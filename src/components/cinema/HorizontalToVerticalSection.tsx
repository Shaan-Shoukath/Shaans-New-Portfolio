"use client";

import { useEffect, useRef, ReactNode } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

interface HorizontalToVerticalSectionProps {
  children: ReactNode;
  id: string;
  className?: string;
}

/**
 * HorizontalToVerticalSection
 * 
 * Uses a single ScrollTrigger that:
 * 1. Pins the outer wrapper
 * 2. Slides child content from x: 100vw → x: 0 (horizontal entrance)
 * 
 * The child's content is placed directly and fills viewport.
 * After the horizontal entrance completes, the pin releases and 
 * the child's own content continues with normal vertical scroll.
 */
export function HorizontalToVerticalSection({
  children,
  id,
  className = "",
}: HorizontalToVerticalSectionProps) {
  const outerRef = useRef<HTMLDivElement>(null);
  const sliderRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const outer = outerRef.current;
    const slider = sliderRef.current;
    if (!outer || !slider) return;

    // Set initial position off-screen right
    gsap.set(slider, { x: "100vw" });

    const st = ScrollTrigger.create({
      trigger: outer,
      pin: true,
      scrub: 1,
      start: "top top",
      end: () => "+=" + window.innerWidth,
      invalidateOnRefresh: true,
      animation: gsap.to(slider, {
        x: 0,
        ease: "none",
      }),
    });

    return () => {
      st.kill();
    };
  }, []);

  return (
    <div
      ref={outerRef}
      id={`${id}-wrapper`}
      className={`h-screen w-screen overflow-hidden relative ${className}`}
    >
      <div
        ref={sliderRef}
        id={id}
        className="w-screen h-screen absolute top-0 left-0 will-change-transform"
      >
        {children}
      </div>
    </div>
  );
}
