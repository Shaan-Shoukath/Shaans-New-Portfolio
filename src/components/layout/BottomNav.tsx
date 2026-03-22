"use client";

import { useState, useEffect, useCallback } from "react";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";
import { Home, Layers, FolderKanban, Mail } from "lucide-react";

const navItems = [
  { label: "Home", href: "#hero", icon: Home },
  { label: "Domains", href: "#domains", icon: Layers },
  { label: "Projects", href: "#projects", icon: FolderKanban },
  { label: "Connect", href: "#contact", icon: Mail },
];

export function BottomNav() {
  const [activeSection, setActiveSection] = useState("#hero");

  /* ── Scroll-spy via IntersectionObserver (rooted in content-shell) ── */
  const updateActive = useCallback((id: string) => {
    setActiveSection(`#${id}`);
  }, []);

  useEffect(() => {
    const shell = document.getElementById("content-shell");
    if (!shell) return;

    const sectionIds = navItems.map((i) => i.href.replace("#", ""));
    const observers: IntersectionObserver[] = [];

    sectionIds.forEach((id) => {
      const el = document.getElementById(id);
      if (!el) return;
      const observer = new IntersectionObserver(
        ([entry]) => {
          if (entry.isIntersecting) updateActive(id);
        },
        { root: shell, rootMargin: "-40% 0px -55% 0px" }
      );
      observer.observe(el);
      observers.push(observer);
    });

    return () => observers.forEach((o) => o.disconnect());
  }, [updateActive]);

  /* ── Navigate by scrolling the content-shell, not the window ── */
  const handleNav = (e: React.MouseEvent<HTMLAnchorElement>, href: string) => {
    e.preventDefault();
    const shell = document.getElementById("content-shell");
    const target = document.getElementById(href.replace("#", ""));
    if (shell && target) {
      shell.scrollTo({ top: target.offsetTop, behavior: "instant" });
    }
  };

  return (
    <motion.nav
      initial={{ y: 80, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.7, delay: 0.5, ease: [0.22, 1, 0.36, 1] }}
      className="fixed bottom-4 left-1/2 -translate-x-1/2 z-50"
    >
      <div className="bottom-nav-pill flex items-center gap-1 px-2 py-2 rounded-full">
        {navItems.map((item) => {
          const isActive = activeSection === item.href;
          const isConnect = item.label === "Connect";

          return (
            <a
              key={item.label}
              href={item.href}
              onClick={(e) => handleNav(e, item.href)}
              className={cn(
                "relative flex items-center gap-2 px-5 py-2.5 rounded-full text-sm font-medium transition-all duration-300 whitespace-nowrap",
                isConnect && !isActive &&
                  "border border-white/15 text-muted-foreground hover:text-foreground hover:border-white/25",
                !isConnect && !isActive &&
                  "text-muted-foreground hover:text-foreground",
                isActive && "text-foreground"
              )}
            >
              {isActive && (
                <motion.div
                  layoutId="bottom-nav-active"
                  className="absolute inset-0 rounded-full bg-white/10 border border-white/15"
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
                  isActive ? "text-indigo-400" : ""
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
