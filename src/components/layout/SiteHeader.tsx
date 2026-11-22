"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { ArrowUpRight } from "lucide-react";
import { scrollToId } from "@/components/motion/MotionRuntime";

const homeLinks = [
  { id: "domains", label: "Domains" },
  { id: "work", label: "Work" },
  { id: "community", label: "Community" },
  { id: "projects", label: "Projects" },
];

/**
 * Site header: wordmark, section links, one CTA. Hides while scrolling down,
 * returns on scroll up. On phones the links move into a full-screen menu.
 */
export function SiteHeader() {
  const onHome = usePathname() === "/";
  const [hidden, setHidden] = useState(false);
  const [solid, setSolid] = useState(false);
  const [open, setOpen] = useState(false);
  const [active, setActive] = useState("");

  useEffect(() => {
    let lastY = window.scrollY;
    const onScroll = () => {
      const y = window.scrollY;
      setSolid(y > 40);
      setHidden(y > 240 && y > lastY);
      lastY = y;
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    if (!onHome) return;
    const io = new IntersectionObserver(
      (entries) => entries.forEach((e) => e.isIntersecting && setActive(e.target.id)),
      { rootMargin: "-45% 0px -50% 0px" }
    );
    ["hero", ...homeLinks.map((l) => l.id), "contact"].forEach((id) => {
      const el = document.getElementById(id);
      if (el) io.observe(el);
    });
    return () => io.disconnect();
  }, [onHome]);

  useEffect(() => {
    document.documentElement.classList.toggle("menu-open", open);
  }, [open]);

  const go = (e: React.MouseEvent, id: string) => {
    setOpen(false);
    if (!onHome) return; // normal navigation to /#id
    e.preventDefault();
    scrollToId(id);
  };

  return (
    <header className={`site-header${hidden && !open ? " is-hidden" : ""}${solid ? " is-solid" : ""}`}>
      <span className="site-header__spacer" aria-hidden="true" />

      <nav aria-label="Primary" className={`site-header__nav${open ? " is-open" : ""}`}>
        <ul>
          {homeLinks.map((l) => (
            <li key={l.id}>
              <Link
                href={`/#${l.id}`}
                onClick={(e) => go(e, l.id)}
                aria-current={active === l.id ? "true" : undefined}
                data-cursor="link"
              >
                {l.label}
              </Link>
            </li>
          ))}
          <li>
            <Link href="/about" onClick={() => setOpen(false)} data-cursor="link">
              About
            </Link>
          </li>
        </ul>
      </nav>

      <div className="site-header__end">
        <Link href="/#contact" onClick={(e) => go(e, "contact")} className="site-header__cta">
          Let&apos;s talk
          <ArrowUpRight aria-hidden="true" />
        </Link>
        <button
          type="button"
          className="site-header__menu"
          aria-expanded={open}
          aria-label={open ? "Close menu" : "Open menu"}
          onClick={() => setOpen((v) => !v)}
        >
          <span />
          <span />
        </button>
      </div>
    </header>
  );
}
