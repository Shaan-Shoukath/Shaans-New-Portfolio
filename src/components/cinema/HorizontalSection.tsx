"use client";

import { useEffect, useRef, ReactNode } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

interface HorizontalSectionProps {
  children: ReactNode;
  id: string;
  className?: string;
}

export function HorizontalSection({
  children,
  id,
  className = "",
}: HorizontalSectionProps) {
  const triggerRef = useRef<HTMLDivElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const trigger = triggerRef.current;
    const container = containerRef.current;
    if (!trigger || !container) return;

    const totalWidth = container.scrollWidth;
    const viewWidth = window.innerWidth;

    const tween = gsap.to(container, {
      x: () => -(totalWidth - viewWidth),
      ease: "none",
      scrollTrigger: {
        trigger: trigger,
        pin: true,
        scrub: 1,
        end: () => "+=" + (totalWidth - viewWidth),
        invalidateOnRefresh: true,
      },
    });

    return () => {
      tween.kill();
      ScrollTrigger.getAll()
        .filter((t) => t.trigger === trigger)
        .forEach((t) => t.kill());
    };
  }, []);

  return (
    <section ref={triggerRef} id={id} className={`overflow-hidden ${className}`}>
      <div
        ref={containerRef}
        className="horizontal-container h-screen items-center"
      >
        {children}
      </div>
    </section>
  );
}
