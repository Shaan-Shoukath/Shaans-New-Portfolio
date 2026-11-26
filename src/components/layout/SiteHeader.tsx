"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useRef, useState } from "react";
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
export function SiteHeader({ resumeUrl }: { resumeUrl: string }) {
  const pathname = usePathname();
  const onHome = pathname === "/";
  const [hidden, setHidden] = useState(false);
  const [solid, setSolid] = useState(false);
  const [open, setOpen] = useState(false);
  const [mobile, setMobile] = useState(false);
  const [active, setActive] = useState("");
  const headerRef = useRef<HTMLElement>(null);
  const menuRef = useRef<HTMLButtonElement>(null);

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

  useEffect(() => setOpen(false), [pathname]);

  useEffect(() => {
    const media = window.matchMedia("(max-width: 900px)");
    const sync = () => {
      setMobile(media.matches);
      if (!media.matches) setOpen(false);
    };
    sync();
    media.addEventListener("change", sync);
    return () => media.removeEventListener("change", sync);
  }, []);

  useEffect(() => {
    const header = headerRef.current;
    if (!open || !header?.parentElement) return;

    const siblings = Array.from(header.parentElement.children).filter((el) => el !== header && !el.hasAttribute("inert"));
    siblings.forEach((el) => el.setAttribute("inert", ""));
    document.documentElement.classList.add("menu-open");
    menuRef.current?.focus({ preventScroll: true });

    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        e.preventDefault();
        setOpen(false);
        menuRef.current?.focus({ preventScroll: true });
        return;
      }
      if (e.key !== "Tab") return;
      const focusable = Array.from(header.querySelectorAll<HTMLElement>("a[href], button:not(:disabled)"))
        .filter((el) => el.tabIndex >= 0 && el.getClientRects().length);
      const first = focusable[0];
      const last = focusable.at(-1);
      if (!first || !last || document.activeElement !== (e.shiftKey ? first : last)) return;
      e.preventDefault();
      (e.shiftKey ? last : first).focus();
    };
    document.addEventListener("keydown", onKeyDown);
    return () => {
      document.removeEventListener("keydown", onKeyDown);
      document.documentElement.classList.remove("menu-open");
      siblings.forEach((el) => el.removeAttribute("inert"));
    };
  }, [open]);

  const go = (e: React.MouseEvent, id: string) => {
    setOpen(false);
    if (!onHome) return; // normal navigation to /#id
    e.preventDefault();
    scrollToId(id);
    const target = document.getElementById(id);
    if (!target) return;
    target.tabIndex = -1;
    requestAnimationFrame(() => target.focus({ preventScroll: true }));
  };

  return (
    <header
      ref={headerRef}
      className={`site-header${hidden && !open ? " is-hidden" : ""}${solid ? " is-solid" : ""}`}
      data-lenis-prevent={open ? "" : undefined}
    >
      {!onHome && (
        <Link href="/" className="site-header__home" onClick={() => setOpen(false)}>
          Shaan Shoukath
        </Link>
      )}
      <span className="site-header__spacer" aria-hidden="true" />

      <nav aria-label="Primary" className={`site-header__nav${open ? " is-open" : ""}`} inert={mobile && !open}>
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
        <ul className="site-header__more">
          <li><Link href="/blog" onClick={() => setOpen(false)}>Blog</Link></li>
          <li><a href={resumeUrl} target="_blank" rel="noopener" data-track="Resume">Resume</a></li>
          <li><Link href="/#contact" onClick={(e) => go(e, "contact")}>Contact</Link></li>
        </ul>
      </nav>

      <div className="site-header__end">
        <Link href="/#contact" onClick={(e) => go(e, "contact")} className="site-header__cta">
          Let&apos;s talk
          <ArrowUpRight aria-hidden="true" />
        </Link>
        <button
          ref={menuRef}
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
