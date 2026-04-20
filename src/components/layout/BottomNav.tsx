"use client";

import { useState, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils";
import { House, Layers, Briefcase, FolderKanban, Mail } from "lucide-react";

const homeItem = { label: "Home", href: "#hero", icon: House };

// Only show Domains in hero pill — Experience/Projects/Connect appear after the sequence ends
const heroNavItems = [
  { label: "Domains", href: "#domains", icon: Layers },
  { label: "Experience", href: "#journey", icon: Briefcase },
  { label: "Projects", href: "#projects", icon: FolderKanban },
  { label: "Connect", href: "#contact", icon: Mail },
];

export function BottomNav() {
  const [activeSection, setActiveSection] = useState("#hero");
  const [inHero, setInHero] = useState(false);

  /* ── Detect whether the hero panel is still on-screen ── */
  useEffect(() => {
    const checkHero = () => {
      const heroPanel = document.querySelector(".hero-dulcedo-panel");
      if (!heroPanel) { setInHero(false); return; }
      const rect = heroPanel.getBoundingClientRect();
      // Pill visible only while hero panel's right edge is still well within viewport
      setInHero(rect.right > window.innerWidth * 0.15);
    };

    checkHero();
    window.addEventListener("scroll", checkHero, { passive: true });
    return () => window.removeEventListener("scroll", checkHero);
  }, []);

  /* ── Scroll-spy ── */
  const updateActive = useCallback((id: string) => {
    setActiveSection(`#${id}`);
  }, []);

  useEffect(() => {
    const sectionIds = [homeItem, ...heroNavItems].map((i) => i.href.replace("#", ""));
    const observers: IntersectionObserver[] = [];

    sectionIds.forEach((id) => {
      const el = document.getElementById(id);
      if (!el) return;
      const observer = new IntersectionObserver(
        ([entry]) => {
          if (entry.isIntersecting) updateActive(id);
        },
        { rootMargin: "-40% 0px -55% 0px" }
      );
      observer.observe(el);
      observers.push(observer);
    });

    return () => observers.forEach((o) => o.disconnect());
  }, [updateActive]);

  /* ── Navigate via Lenis / GSAP-aware scroll ── */
  const handleNav = (e: React.MouseEvent<HTMLAnchorElement>, href: string) => {
    e.preventDefault();
    const id = href.replace("#", "");

    // Domains lives inside the GSAP pinned section — navigate to it by scrolling
    // to the hero's top offset plus the handoff distance (≈55% of viewport width).
    if (id === "domains") {
      const heroSection = document.getElementById("hero");
      if (heroSection) {
        const heroTop = heroSection.getBoundingClientRect().top + window.scrollY;
        const handoffDistance = Math.max(window.innerWidth * 0.55, 500);
        const targetScrollY = heroTop + handoffDistance;
        const lenis = (window as unknown as Record<string, unknown>).__lenis as
          | { scrollTo: (target: number | Element, opts?: Record<string, unknown>) => void }
          | undefined;
        if (lenis) {
          lenis.scrollTo(targetScrollY, { duration: 1.2 });
        } else {
          window.scrollTo({ top: targetScrollY, behavior: "smooth" });
        }
      }
      return;
    }

    const target = document.getElementById(id);
    if (!target) return;
    const lenis = (window as unknown as Record<string, unknown>).__lenis as
      | { scrollTo: (target: number | Element, opts?: Record<string, unknown>) => void }
      | undefined;
    if (lenis) {
      lenis.scrollTo(target, { offset: 0 });
    } else {
      target.scrollIntoView({ behavior: "smooth" });
    }
  };

  return (
    <motion.nav
      initial={{ y: 80, opacity: 0 }}
      animate={{ y: inHero ? 0 : 80, opacity: inHero ? 1 : 0 }}
      transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
      className="fixed bottom-4 left-1/2 -translate-x-1/2 z-50"
      style={{ pointerEvents: inHero ? "auto" : "none" }}
    >
      <div
        className="flex items-center gap-1 px-2 py-2 rounded-full"
        style={{
          background: "rgba(255,255,255,0.07)",
          backdropFilter: "blur(40px)",
          WebkitBackdropFilter: "blur(40px)",
          border: "1px solid rgba(255,255,255,0.18)",
          boxShadow: "0 8px 32px rgba(0,0,0,0.4), 0 1px 0 rgba(255,255,255,0.12) inset",
        }}
      >
        {/* Home — always shown while pill is visible */}
        {(() => {
          const item = homeItem;
          const isActive = activeSection === item.href;
          return (
            <a
              key={item.label}
              href={item.href}
              onClick={(e) => handleNav(e, item.href)}
              className={cn(
                "relative flex items-center gap-2 px-4 py-2.5 rounded-full text-sm font-medium transition-all duration-300 whitespace-nowrap",
                !isActive && "text-white/50 hover:text-white",
                isActive && "text-white"
              )}
            >
              {isActive && (
                <motion.div
                  layoutId="bottom-nav-active"
                  className="absolute inset-0 rounded-full"
                  style={{
                    background: "rgba(255,255,255,0.14)",
                    border: "1px solid rgba(255,255,255,0.28)",
                    boxShadow: "0 2px 12px rgba(255,255,255,0.06) inset",
                  }}
                  transition={{ type: "spring", stiffness: 400, damping: 30 }}
                />
              )}
              <item.icon className={cn("w-4 h-4 relative z-10 transition-colors duration-300", isActive ? "text-white" : "")} />
              <span className="relative z-10 hidden sm:inline">{item.label}</span>
            </a>
          );
        })()}

        {heroNavItems.map((item) => {
          const isActive = activeSection === item.href;
          const isConnect = item.label === "Connect";

          return (
            <a
              key={item.label}
              href={item.href}
              onClick={(e) => handleNav(e, item.href)}
              className={cn(
                "relative flex items-center gap-2 px-4 py-2.5 rounded-full text-sm font-medium transition-all duration-300 whitespace-nowrap",
                isConnect && !isActive &&
                  "border border-white/25 text-white/50 hover:text-white hover:border-white/45",
                !isConnect && !isActive &&
                  "text-white/50 hover:text-white",
                isActive && "text-white"
              )}
            >
              {isActive && (
                <motion.div
                  layoutId="bottom-nav-active"
                  className="absolute inset-0 rounded-full"
                  style={{
                    background: "rgba(255,255,255,0.14)",
                    border: "1px solid rgba(255,255,255,0.28)",
                    boxShadow: "0 2px 12px rgba(255,255,255,0.06) inset",
                  }}
                  transition={{
                    type: "spring",
                    stiffness: 400,
                    damping: 30,
                  }}
                />
              )}
              <item.icon
                className={cn(
                  "w-4 h-4 relative z-10 transition-colors duration-300",
                  isActive ? "text-white" : ""
                )}
              />
              <span className="relative z-10 hidden sm:inline">{item.label}</span>
            </a>
          );
        })}
      </div>
    </motion.nav>
  );
}
