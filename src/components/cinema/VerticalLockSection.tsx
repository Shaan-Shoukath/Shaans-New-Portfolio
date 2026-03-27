"use client";

import { useEffect, useRef, ReactNode } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

interface VerticalLockSectionProps {
  children: ReactNode;
  id: string;
  panelCount: number;
  className?: string;
}

export function VerticalLockSection({
  children,
  id,
  panelCount,
  className = "",
}: VerticalLockSectionProps) {
  const triggerRef = useRef<HTMLDivElement>(null);
  const innerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const trigger = triggerRef.current;
    const inner = innerRef.current;
    if (!trigger || !inner || panelCount <= 1) return;

    const tween = gsap.to(inner, {
      y: () => -(panelCount - 1) * window.innerHeight,
      ease: "none",
      scrollTrigger: {
        trigger: trigger,
        pin: true,
        scrub: 1,
        end: () => "+=" + (panelCount - 1) * window.innerHeight,
        invalidateOnRefresh: true,
      },
    });

    return () => {
      tween.kill();
      ScrollTrigger.getAll()
        .filter((t) => t.trigger === trigger)
        .forEach((t) => t.kill());
    };
  }, [panelCount]);

  return (
    <section
      ref={triggerRef}
      id={id}
      className={`h-screen overflow-hidden ${className}`}
    >
      <div ref={innerRef} className="will-change-transform">
        {children}
      </div>
    </section>
  );
}
