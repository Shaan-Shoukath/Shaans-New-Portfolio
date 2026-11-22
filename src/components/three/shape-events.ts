import type { ShapeName } from "./stations";

export const SHAPE_EVENT = "pointfield:shape";

export type ShapeDetail = { shape: ShapeName; accent: string };

// Remembered so a canvas that mounts late (lazy chunk) starts on the right shape.
let latest: ShapeDetail | null = null;

export function emitShape(detail: ShapeDetail) {
  latest = detail;
  window.dispatchEvent(new CustomEvent(SHAPE_EVENT, { detail }));
}

export function latestShape() {
  return latest;
}
