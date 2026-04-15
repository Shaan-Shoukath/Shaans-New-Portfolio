"use client";

/**
 * Get normalized positions (0-1) for each node along the path.
 */
export function getNodePositions(nodeCount: number): number[] {
  const positions: number[] = [];
  for (let i = 0; i < nodeCount; i++) {
    positions.push((i + 1) / (nodeCount + 1));
  }
  return positions;
}

/**
 * Get a point on the actual SVG path using the DOM API.
 * Call this from the parent component with the actual path element.
 */
export function getPointOnSVGPath(
  pathEl: SVGPathElement,
  progress: number
): { x: number; y: number; angle: number } {
  const len = pathEl.getTotalLength();
  const point = pathEl.getPointAtLength(progress * len);

  // Calculate angle from a tiny step ahead
  const step = Math.min(0.001, 1 - progress);
  const nextPoint = pathEl.getPointAtLength((progress + step) * len);
  const angle = Math.atan2(nextPoint.y - point.y, nextPoint.x - point.x) * (180 / Math.PI);

  return { x: point.x, y: point.y, angle };
}
