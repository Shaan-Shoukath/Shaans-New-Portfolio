"use client";

import { useEffect, useRef, type ReactNode } from "react";
import Lenis from "lenis";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

interface ScrollEngineProps {
  children: ReactNode;
}

export function ScrollEngine({ children }: ScrollEngineProps) {
  const lenisRef = useRef<Lenis | null>(null);

  useEffect(() => {
    const shouldResetHomeScroll =
      window.location.pathname === "/" && window.location.hash === "";

    if ("scrollRestoration" in window.history) {
      window.history.scrollRestoration = "manual";
    }

    if (shouldResetHomeScroll) {
      window.scrollTo(0, 0);
    }

    // Ignore resize events caused by mobile browser toolbar show/hide.
    // Without this, every toolbar toggle fires ScrollTrigger.refresh() which
    // destroys and rebuilds pinned sections in one frame -> visible blink.
    ScrollTrigger.config({ ignoreMobileResize: true });

    const lenis = new Lenis({
      duration: 1.2,
      easing: (t: number) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      wheelMultiplier: 1.1,
      touchMultiplier: 1.2,
      infinite: false,
    });

    lenisRef.current = lenis;
    (window as unknown as Record<string, unknown>).__lenis = lenis;
    lenis.on("scroll", ScrollTrigger.update);

    if (shouldResetHomeScroll) {
      lenis.scrollTo(0, { immediate: true });
    }

    const ticker = (time: number) => {
      lenis.raf(time * 1000);
    };

    gsap.ticker.add(ticker);
    gsap.ticker.lagSmoothing(0);

    const refreshId = window.requestAnimationFrame(() => {
      window.requestAnimationFrame(() => {
        if (shouldResetHomeScroll) {
          lenis.scrollTo(0, { immediate: true });
        }
        ScrollTrigger.refresh();
      });
    });

    return () => {
      delete (window as unknown as Record<string, unknown>).__lenis;
      lenis.destroy();
      gsap.ticker.remove(ticker);
      window.cancelAnimationFrame(refreshId);
      // Individual section components clean up their own ScrollTriggers
      // via gsap.context().revert(). Do NOT kill all triggers globally here.
    };
  }, []);

  return (
    <div id="smooth-wrapper">
      <div id="smooth-content">{children}</div>
    </div>
  );
}
