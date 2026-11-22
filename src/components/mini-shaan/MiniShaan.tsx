import type { CSSProperties } from "react";

/**
 * Mini Shaan sprite. Sheet: public/mini-shaan/sheet-v1.webp, 8 columns x 9
 * rows, 144x156 cells. Each state is a CSS steps() animation (globals.css),
 * so it costs no JS and freezes on its first frame under reduced motion.
 */
export type MiniShaanState =
  | "idle"
  | "run-right"
  | "run-left"
  | "wave"
  | "jump"
  | "facepalm"
  | "wait"
  | "think";

export function MiniShaan({
  state = "idle",
  size = 120,
  className = "",
  label,
}: {
  state?: MiniShaanState;
  size?: number;
  className?: string;
  /** Pass a label only where the mascot carries meaning; otherwise it's decorative. */
  label?: string;
}) {
  return (
    <span
      className={`mini-shaan ${className}`}
      data-state={state}
      style={{ "--ms-w": `${size}px` } as CSSProperties}
      role={label ? "img" : undefined}
      aria-label={label}
      aria-hidden={label ? undefined : true}
    />
  );
}
