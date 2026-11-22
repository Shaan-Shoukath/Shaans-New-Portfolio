"use client";

import { useEffect, useRef, useState } from "react";

const FINE = "(hover: hover) and (pointer: fine)";
const INTERACTIVE = "a, button, [role='button'], summary, label, select, [data-cursor]";
const TEXT_FIELD =
  "textarea, [contenteditable=''], [contenteditable='true'], input:not([type='button']):not([type='submit']):not([type='checkbox']):not([type='radio']):not([type='range'])";

/**
 * Pointer: a single red dot locked to the mouse (no trailing element, so it can
 * never lag or detach). It morphs into a ring over interactive elements and a
 * labelled pill over [data-cursor-label]. Press G to toggle the 12-column grid.
 * Mouse/trackpad only: touch, pen-without-hover and reduced motion keep the
 * system cursor.
 */
export function Cursor() {
  const cursor = useRef<HTMLDivElement>(null);
  const label = useRef<HTMLSpanElement>(null);
  const [grid, setGrid] = useState(false);
  const [enabled, setEnabled] = useState(false);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      const t = e.target as HTMLElement;
      if (t.closest("input, textarea, [contenteditable]") || e.metaKey || e.ctrlKey || e.altKey) return;
      if (e.key === "g" || e.key === "G") setGrid((v) => !v);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  // Follow the device: plugging a mouse into a tablet (or unplugging it) flips the mode.
  useEffect(() => {
    const fine = window.matchMedia(FINE);
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)");
    const sync = () => setEnabled(fine.matches && !reduced.matches);
    sync();
    fine.addEventListener("change", sync);
    reduced.addEventListener("change", sync);
    return () => {
      fine.removeEventListener("change", sync);
      reduced.removeEventListener("change", sync);
    };
  }, []);

  useEffect(() => {
    const c = cursor.current;
    const l = label.current;
    if (!enabled || !c || !l) return;
    const root = document.documentElement;
    root.classList.add("has-cursor");

    let x = 0;
    let y = 0;
    let menuOpen = false;
    let currentLabel = "";

    const show = (on: boolean) => c.classList.toggle("is-visible", on);
    const release = () => c.classList.remove("is-down");

    const inspect = (target: Element | null) => {
      const text = target?.closest<HTMLElement>("[data-cursor-label]")?.dataset.cursorLabel ?? "";
      if (text !== currentLabel) {
        currentLabel = text;
        if (text) l.textContent = `${text} ↗`; // keep the old text while the pill scales out
      }
      c.dataset.state = text ? "label" : target?.closest(INTERACTIVE) ? "hover" : "";
      root.classList.toggle("cursor-text", Boolean(target?.closest(TEXT_FIELD)));
    };

    const onMove = (e: PointerEvent) => {
      // Hybrid devices: a touch hands control back to the system cursor.
      if (e.pointerType === "touch") return show(false);
      menuOpen = false;
      x = e.clientX;
      y = e.clientY;
      // Written straight away (browsers already coalesce moves to one per frame), so
      // the dot is never a frame behind and never flashes at 0,0 when it first appears.
      c.style.transform = `translate3d(${x}px, ${y}px, 0)`;
      inspect(e.target as Element | null);
      show(true);
    };
    // Content moves under a still pointer while scrolling: re-read what's under it.
    let scrollQueued = false;
    const onScroll = () => {
      if (scrollQueued || !c.classList.contains("is-visible")) return;
      scrollQueued = true;
      requestAnimationFrame(() => {
        scrollQueued = false;
        inspect(document.elementFromPoint(x, y));
      });
    };
    // Only the primary button presses the dot; the right-click menu swallows pointerup.
    const onDown = (e: PointerEvent) => {
      if (e.button === 0 && e.pointerType !== "touch") c.classList.add("is-down");
    };
    const onMenu = () => {
      release();
      menuOpen = true;
    };
    // An open context menu can report the pointer as gone; keep the dot until it moves.
    const onLeave = () => {
      release();
      if (!menuOpen) show(false);
    };
    const onVisibility = () => {
      if (document.visibilityState === "hidden") {
        release();
        show(false);
      }
    };

    window.addEventListener("pointermove", onMove, { passive: true });
    window.addEventListener("pointerdown", onDown, { passive: true });
    window.addEventListener("pointerup", release);
    window.addEventListener("pointercancel", release);
    window.addEventListener("dragend", release);
    window.addEventListener("blur", release);
    window.addEventListener("contextmenu", onMenu);
    window.addEventListener("scroll", onScroll, { passive: true });
    root.addEventListener("pointerleave", onLeave);
    document.addEventListener("visibilitychange", onVisibility);
    return () => {
      show(false);
      release();
      root.classList.remove("has-cursor", "cursor-text");
      window.removeEventListener("pointermove", onMove);
      window.removeEventListener("pointerdown", onDown);
      window.removeEventListener("pointerup", release);
      window.removeEventListener("pointercancel", release);
      window.removeEventListener("dragend", release);
      window.removeEventListener("blur", release);
      window.removeEventListener("contextmenu", onMenu);
      window.removeEventListener("scroll", onScroll);
      root.removeEventListener("pointerleave", onLeave);
      document.removeEventListener("visibilitychange", onVisibility);
    };
  }, [enabled]);

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
      <div ref={cursor} className="cursor" aria-hidden="true">
        <div className="cursor__shape" />
        <span ref={label} className="cursor__label" />
      </div>
    </>
  );
}
