"use client";

import { useRef, useEffect, useState } from "react";

interface JourneyPathProps {
  progress: number;
  nodeCount: number;
  width: number;
  height: number;
}

export function JourneyPath({ progress, nodeCount, width, height }: JourneyPathProps) {
  const pathRef = useRef<SVGPathElement>(null);
  const glowRef = useRef<SVGPathElement>(null);
  const [totalLength, setTotalLength] = useState(0);

  // Generate a smooth wave path spanning the full width
  const pathD = generateJourneyPath(width, height, nodeCount);

  useEffect(() => {
    if (pathRef.current) {
      const len = pathRef.current.getTotalLength();
      setTotalLength(len);
    }
  }, [pathD]);

  const dashOffset = totalLength - progress * totalLength;

  return (
    <svg
      className="journey-path-svg"
      viewBox={`0 0 ${width} ${height}`}
      preserveAspectRatio="none"
      aria-hidden="true"
    >
      <defs>
        {/* Glow filter for the active path */}
        <filter id="journey-glow" x="-20%" y="-20%" width="140%" height="140%">
          <feGaussianBlur in="SourceGraphic" stdDeviation="6" result="blur" />
          <feColorMatrix
            in="blur"
            type="matrix"
            values="0 0 0 0 0.86  0 0 0 0 0.15  0 0 0 0 0.15  0 0 0 0.6 0"
          />
          <feMerge>
            <feMergeNode />
            <feMergeNode in="SourceGraphic" />
          </feMerge>
        </filter>

        {/* Gradient for the revealed path */}
        <linearGradient id="journey-path-gradient" x1="0%" y1="0%" x2="100%" y2="0%">
          <stop offset="0%" stopColor="rgba(220, 38, 38, 0.8)" />
          <stop offset="50%" stopColor="rgba(239, 68, 68, 0.6)" />
          <stop offset="100%" stopColor="rgba(248, 113, 113, 0.4)" />
        </linearGradient>
      </defs>

      {/* Background track (dimmed full path) */}
      <path
        d={pathD}
        fill="none"
        stroke="rgba(255, 255, 255, 0.04)"
        strokeWidth="2"
        strokeLinecap="round"
      />

      {/* Dashed guide */}
      <path
        d={pathD}
        fill="none"
        stroke="rgba(255, 255, 255, 0.06)"
        strokeWidth="1"
        strokeDasharray="8 16"
        strokeLinecap="round"
      />

      {/* Glow path (behind main) */}
      <path
        ref={glowRef}
        d={pathD}
        fill="none"
        stroke="rgba(220, 38, 38, 0.3)"
        strokeWidth="6"
        strokeLinecap="round"
        strokeDasharray={totalLength}
        strokeDashoffset={dashOffset}
        filter="url(#journey-glow)"
        style={{ transition: "stroke-dashoffset 0.1s ease-out" }}
      />

      {/* Main revealed path */}
      <path
        ref={pathRef}
        d={pathD}
        fill="none"
        stroke="url(#journey-path-gradient)"
        strokeWidth="2"
        strokeLinecap="round"
        strokeDasharray={totalLength}
        strokeDashoffset={dashOffset}
        style={{ transition: "stroke-dashoffset 0.1s ease-out" }}
      />

      {/* Node markers on the path */}
      {getNodePositions(nodeCount).map((t, i) => {
        const point = getPointOnPath(pathD, t, width, height);
        const isActive = progress >= t - 0.02;
        return (
          <g key={i}>
            {/* Outer ring */}
            <circle
              cx={point.x}
              cy={point.y}
              r={isActive ? 12 : 8}
              fill="none"
              stroke={isActive ? "rgba(220, 38, 38, 0.6)" : "rgba(255, 255, 255, 0.08)"}
              strokeWidth={isActive ? 2 : 1}
              style={{ transition: "all 0.4s ease" }}
            />
            {/* Inner dot */}
            <circle
              cx={point.x}
              cy={point.y}
              r={isActive ? 4 : 3}
              fill={isActive ? "rgba(220, 38, 38, 0.8)" : "rgba(255, 255, 255, 0.15)"}
              style={{ transition: "all 0.4s ease" }}
            />
            {/* Active pulse */}
            {isActive && (
              <circle
                cx={point.x}
                cy={point.y}
                r="18"
                fill="none"
                stroke="rgba(220, 38, 38, 0.2)"
                strokeWidth="1"
                className="journey-node-pulse"
              />
            )}
          </g>
        );
      })}
    </svg>
  );
}

/**
 * Generate a smooth bezier curve path that spans the horizontal journey.
 * The path creates gentle waves, with node positions at evenly-spaced intervals.
 */
function generateJourneyPath(width: number, height: number, nodeCount: number): string {
  const midY = height * 0.5;
  const amplitude = height * 0.18;
  const segments = nodeCount + 1;
  const segWidth = width / segments;

  let d = `M 0 ${midY}`;

  for (let i = 0; i < segments; i++) {
    const x1 = i * segWidth + segWidth * 0.33;
    const x2 = i * segWidth + segWidth * 0.66;
    const x3 = (i + 1) * segWidth;
    const direction = i % 2 === 0 ? -1 : 1;
    const cy1 = midY + direction * amplitude;
    const cy2 = midY + direction * amplitude * 0.5;
    const endY = i === segments - 1 ? midY : midY;

    d += ` C ${x1} ${cy1}, ${x2} ${cy2}, ${x3} ${endY}`;
  }

  return d;
}

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
 * Approximate a point on the path at parameter t (0-1).
 * This is a rough approximation for positioning nodes.
 */
function getPointOnPath(pathD: string, t: number, width: number, height: number) {
  // Simple approximation: x is linear, y follows the wave
  const midY = height * 0.5;
  const amplitude = height * 0.18;
  const x = t * width;
  const segments = 4; // approximate
  const phase = (t * segments) % 2;
  const direction = phase < 1 ? -1 : 1;
  const localT = phase < 1 ? phase : phase - 1;
  const y = midY + direction * amplitude * Math.sin(localT * Math.PI) * 0.3;

  return { x, y: y || midY };
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
