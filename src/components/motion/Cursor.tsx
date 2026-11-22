"use client";

import { useEffect, useRef, useState } from "react";

/**
 * Pointer: an exact dot and a trailing ring that grows over interactive
 * elements (and shows a label for [data-cursor-label]). Press G to toggle the
 * 12-column layout grid. Fine pointers only; touch and reduced motion keep
 * the system cursor.
 */
export function Cursor() {
  const dot = useRef<HTMLDivElement>(null);
  const ring = useRef<HTMLDivElement>(null);
  const label = useRef<HTMLSpanElement>(null);
  const [grid, setGrid] = useState(false);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      const t = e.target as HTMLElement;
      if (t.closest("input, textarea, [contenteditable]") || e.metaKey || e.ctrlKey || e.altKey) return;
      if (e.key === "g" || e.key === "G") setGrid((v) => !v);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  useEffect(() => {
    const fine = window.matchMedia("(pointer: fine)").matches;
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const els = [dot.current, ring.current, label.current];
    if (!fine || reduced || els.some((e) => !e)) return;
    const [d, r, l] = els as HTMLElement[];
    const root = document.documentElement;
    root.classList.add("has-cursor");

    const pos = { x: -100, y: -100 };
    const ringPos = { x: -100, y: -100 };
    let raf = 0;
    let last = performance.now();
    let entered = false;

    const loop = (now: number) => {
      // Time-based easing: the ring keeps up even when frames drop under load.
      const k = 1 - Math.exp(-(now - last) / 45);
      last = now;
      ringPos.x += (pos.x - ringPos.x) * k;
      ringPos.y += (pos.y - ringPos.y) * k;
      d.style.transform = `translate3d(${pos.x}px, ${pos.y}px, 0)`;
      r.style.transform = `translate3d(${ringPos.x}px, ${ringPos.y}px, 0)`;
      raf = requestAnimationFrame(loop);
    };
    raf = requestAnimationFrame(loop);

    const onMove = (e: PointerEvent) => {
      pos.x = e.clientX;
      pos.y = e.clientY;
      if (!entered) {
        // Snap on (re-)entry instead of flying in from off-screen.
        entered = true;
        ringPos.x = pos.x;
        ringPos.y = pos.y;
      }
      const target = e.target as Element | null;
      const labelled = target?.closest<HTMLElement>("[data-cursor-label]");
      const interactive = target?.closest("a, button, input, textarea, label, [data-cursor]");
      const text = labelled?.dataset.cursorLabel ?? "";
      l.textContent = text;
      r.dataset.state = text ? "label" : interactive ? "hover" : "";
      root.classList.toggle("cursor-text", Boolean(target?.closest("input, textarea")));
    };
    // Content moves under a still pointer while scrolling; drop stale hover labels.
    const onScroll = () => {
      if (!r.dataset.state) return;
      r.dataset.state = "";
      l.textContent = "";
    };
    // Only the primary button presses the ring. A right-click opens the native
    // menu, which swallows the matching pointerup and would leave it stuck.
    const onDown = (e: PointerEvent) => {
      if (e.button === 0) r.classList.add("is-down");
    };
    const release = () => r.classList.remove("is-down");
    // While the context menu is open the browser may report the pointer as having
    // left the page; keep the cursor where it was until the pointer moves again.
    let menuOpen = false;
    const onMenu = () => {
      release();
      menuOpen = true;
    };
    const onLeave = () => {
      release();
      if (menuOpen) return;
      pos.x = pos.y = -100;
      entered = false;
    };

    const onMoveAll = (e: PointerEvent) => {
      menuOpen = false;
      onMove(e);
    };

    window.addEventListener("pointermove", onMoveAll, { passive: true });
    window.addEventListener("pointerdown", onDown);
    window.addEventListener("pointerup", release);
    window.addEventListener("pointercancel", release);
    window.addEventListener("dragend", release);
    window.addEventListener("blur", release);
    window.addEventListener("contextmenu", onMenu);
    window.addEventListener("scroll", onScroll, { passive: true });
    document.documentElement.addEventListener("pointerleave", onLeave);
    return () => {
      window.removeEventListener("scroll", onScroll);
      cancelAnimationFrame(raf);
      root.classList.remove("has-cursor", "cursor-text");
      window.removeEventListener("pointermove", onMoveAll);
      window.removeEventListener("pointerdown", onDown);
      window.removeEventListener("pointerup", release);
      window.removeEventListener("pointercancel", release);
      window.removeEventListener("dragend", release);
      window.removeEventListener("blur", release);
      window.removeEventListener("contextmenu", onMenu);
      document.documentElement.removeEventListener("pointerleave", onLeave);
    };
  }, []);

  return (
    <>
      <div className={`grid-overlay${grid ? " is-on" : ""}`} aria-hidden="true">
        <div className="grid-overlay__cols">
          {Array.from({ length: 12 }, (_, i) => (
            <span key={i} />
          ))}
        </div>
        {grid && <p className="grid-overlay__hint">12 col · press G to hide</p>}
      </div>
      <div ref={ring} className="cursor-ring" aria-hidden="true">
        <span ref={label} className="cursor-ring__label" />
      </div>
      <div ref={dot} className="cursor-dot" aria-hidden="true" />
    </>
  );
}
