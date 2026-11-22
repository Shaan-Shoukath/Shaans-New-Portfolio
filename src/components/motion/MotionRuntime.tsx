"use client";

import { useEffect } from "react";
import { usePathname } from "next/navigation";
import Lenis from "lenis";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { SplitText } from "gsap/SplitText";

gsap.registerPlugin(ScrollTrigger, SplitText);

type LenisWindow = Window & { __lenis?: Lenis };

export const INTRO_DONE = "intro:done";

/**
 * Page-wide motion, one island:
 *  - Lenis smooth scroll driven by GSAP's ticker and synced to ScrollTrigger
 *  - SplitText masked line reveals for [data-split] headings
 *  - Batched entrances for [data-reveal]
 *  - Hero intro timeline, held until the first-visit loader lifts
 *  - Spotlight + magnetic pointer helpers
 * Everything is visible by default; JS only adds motion on top. Reduced
 * motion skips it all.
 */
export function MotionRuntime() {
  const pathname = usePathname();

  useEffect(() => {
    const root = document.documentElement;
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const finePointer = window.matchMedia("(pointer: fine)").matches;
    const cleanups: Array<() => void> = [];

    if (reduced) {
      root.classList.add("motion-reduced");
      return () => root.classList.remove("motion-reduced");
    }

    // ── Smooth scroll ──
    let lenis: Lenis | null = null;
    if (finePointer) {
      lenis = new Lenis({ duration: 1.15, smoothWheel: true });
      (window as LenisWindow).__lenis = lenis;
      lenis.on("scroll", ScrollTrigger.update);
      const tick = (time: number) => lenis?.raf(time * 1000);
      gsap.ticker.add(tick);
      gsap.ticker.lagSmoothing(0);
      cleanups.push(() => {
        gsap.ticker.remove(tick);
        lenis?.destroy();
        delete (window as LenisWindow).__lenis;
      });
    }

    const ctx = gsap.context(() => {
      // ── Hero intro ──
      const heroTitle = document.querySelector<HTMLElement>('[data-split="hero"]');
      if (heroTitle) {
        const split = SplitText.create(heroTitle, { type: "lines,chars", mask: "lines" });
        const tl = gsap.timeline({ paused: true });
        tl.set(heroTitle, { visibility: "visible" })
          .from(split.chars, {
            yPercent: 115,
            rotate: 8,
            duration: 1.2,
            ease: "expo.out",
            stagger: 0.028,
          })
          .from([".hero__name", ".hero__desc"], { y: 24, autoAlpha: 0, duration: 1, ease: "expo.out", stagger: 0.12 }, 0.2)
          .from(".point-stage", { autoAlpha: 0, scale: 1.04, duration: 1.8, ease: "power2.out" }, 0.1);

        const play = () => tl.play();
        if (root.classList.contains("intro-running")) {
          window.addEventListener(INTRO_DONE, play, { once: true });
          cleanups.push(() => window.removeEventListener(INTRO_DONE, play));
        } else play();
        cleanups.push(() => split.revert());
      }

      // ── Chapter titles: masked line reveals ──
      document.querySelectorAll<HTMLElement>('[data-split="title"]').forEach((el) => {
        SplitText.create(el, {
          type: "lines",
          mask: "lines",
          autoSplit: true,
          onSplit(self) {
            return gsap.from(self.lines, {
              yPercent: 110,
              duration: 1.2,
              ease: "expo.out",
              stagger: 0.09,
              scrollTrigger: { trigger: el, start: "top 88%", once: true },
            });
          },
        });
      });

      // ── Generic entrances, batched so siblings stagger together ──
      const reveals = gsap.utils.toArray<HTMLElement>("[data-reveal]");
      gsap.set(reveals, { autoAlpha: 0, y: 40 });
      ScrollTrigger.batch(reveals, {
        start: "top 90%",
        once: true,
        onEnter: (batch) =>
          gsap.to(batch, { autoAlpha: 1, y: 0, duration: 1.1, ease: "expo.out", stagger: 0.09, overwrite: true }),
      });

      // ── Projects: pinned horizontal gallery on desktop ──
      const mm = gsap.matchMedia();
      mm.add("(min-width: 1024px)", () => {
        const gallery = document.querySelector<HTMLElement>("[data-gallery]");
        const track = gallery?.querySelector<HTMLElement>(".gallery__track");
        if (!gallery || !track) return;
        const distance = () => Math.max(0, track.scrollWidth - window.innerWidth);
        // Cards lean ("squeeze") with scroll speed, then settle flat.
        // The track's transform belongs to the scroll tween, so the lean goes on the
        // cards via a CSS variable (eased in CSS). Settles after scrolling stops.
        let settle = 0;
        const lean = (v: number) => {
          track.style.setProperty("--lean", `${v.toFixed(2)}deg`);
          window.clearTimeout(settle);
          settle = window.setTimeout(() => track.style.setProperty("--lean", "0deg"), 140);
        };
        gsap.to(track, {
          x: () => -distance(),
          ease: "none",
          scrollTrigger: {
            trigger: gallery,
            start: "center center",
            end: () => `+=${distance()}`,
            pin: true,
            // Lenis already smooths the wheel; a scrub delay on top made it feel laggy.
            scrub: true,
            invalidateOnRefresh: true,
            onUpdate: (self) => lean(gsap.utils.clamp(-5, 5, self.getVelocity() / -450)),
            onLeave: () => lean(0),
            onLeaveBack: () => lean(0),
          },
        });
      });

      // ── Community: the page eases into a light theme, then back to noir ──
      const community = document.getElementById("community");
      if (community) {
        ScrollTrigger.create({
          trigger: community,
          start: "top 55%",
          end: "bottom 75%",
          toggleClass: { targets: root, className: "theme-light" },
        });
      }

      // ── Decode-scramble for mono labels as they arrive ──
      gsap.utils.toArray<HTMLElement>("[data-scramble]").forEach((el) => {
        ScrollTrigger.create({
          trigger: el,
          start: "top 92%",
          once: true,
          onEnter: () => scramble(el),
        });
      });

      // ── Statement words drift up slightly as the paragraph scrubs ──
      gsap.utils.toArray<HTMLElement>(".statement__text").forEach((el) => {
        gsap.from(el, {
          y: 60,
          ease: "none",
          scrollTrigger: { trigger: el, start: "top bottom", end: "center center", scrub: true },
        });
      });
    });
    cleanups.push(() => ctx.revert());

    // Nav links decode on hover.
    const onHover = (e: Event) => {
      const a = (e.target as Element | null)?.closest<HTMLElement>(".site-header__nav a");
      if (a) scramble(a);
    };
    document.addEventListener("pointerover", onHover);
    cleanups.push(() => document.removeEventListener("pointerover", onHover));

    // Fonts change line breaks; re-measure once they're in.
    document.fonts?.ready.then(() => ScrollTrigger.refresh());

    // ── Pointer helpers ──
    const onPointer = (e: PointerEvent) => {
      const target = (e.target as Element | null)?.closest<HTMLElement>("[data-spotlight]");
      if (target) {
        const r = target.getBoundingClientRect();
        target.style.setProperty("--mx", `${e.clientX - r.left}px`);
        target.style.setProperty("--my", `${e.clientY - r.top}px`);
      }
      const magnet = (e.target as Element | null)?.closest<HTMLElement>("[data-magnetic]");
      document.querySelectorAll<HTMLElement>("[data-magnetic]").forEach((m) => {
        if (m !== magnet) {
          m.style.removeProperty("--pull-x");
          m.style.removeProperty("--pull-y");
        }
      });
      if (magnet) {
        const r = magnet.getBoundingClientRect();
        magnet.style.setProperty("--pull-x", `${(e.clientX - r.left - r.width / 2) * 0.25}px`);
        magnet.style.setProperty("--pull-y", `${(e.clientY - r.top - r.height / 2) * 0.35}px`);
      }
    };
    if (finePointer) {
      window.addEventListener("pointermove", onPointer, { passive: true });
      cleanups.push(() => window.removeEventListener("pointermove", onPointer));
    }

    cleanups.push(() => root.classList.remove("theme-light"));
    return () => cleanups.reverse().forEach((fn) => fn());
  }, [pathname]);

  return null;
}

/** Smooth-scroll to an in-page anchor, through Lenis when it's running. */
export function scrollToId(id: string) {
  const target = document.getElementById(id);
  if (!target) return;
  const lenis = (window as LenisWindow).__lenis;
  if (lenis) lenis.scrollTo(target, { offset: 0, duration: 1.4 });
  else target.scrollIntoView({ behavior: "smooth", block: "start" });
  history.replaceState(null, "", `#${id}`);
}

const GLYPHS = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789/<>_#";

/** Terminal-style decode: characters churn, then resolve left to right. */
function scramble(el: HTMLElement) {
  if (el.dataset.scrambling) return;
  const text = el.dataset.scrambleText ?? el.textContent ?? "";
  el.dataset.scrambleText = text;
  el.dataset.scrambling = "1";
  const total = 14 + text.length;
  let frame = 0;
  const tick = () => {
    frame++;
    const reveal = Math.floor((frame / total) * text.length * 1.4);
    el.textContent = text
      .split("")
      .map((ch, i) => (ch === " " || i < reveal ? ch : GLYPHS[(Math.random() * GLYPHS.length) | 0]))
      .join("");
    if (frame < total) requestAnimationFrame(tick);
    else {
      el.textContent = text;
      delete el.dataset.scrambling;
    }
  };
  requestAnimationFrame(tick);
}
