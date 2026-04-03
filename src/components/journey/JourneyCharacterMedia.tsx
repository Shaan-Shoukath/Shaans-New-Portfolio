"use client";

import { type CSSProperties, useCallback, useEffect, useState } from "react";

interface JourneyCharacterMediaProps {
  x: number;
  y: number;
  angle: number;
  isPlaying: boolean;
  pathHeight: number;
  /** Vertical offset in px — positive = below path, negative = above path */
  yOffset?: number;
  scale?: number;
  onReadyChange?: (ready: boolean) => void;
}

type GifSource = {
  src: string;
  poster?: string;
};

// Drop custom GIF files into public/journey/media. First available wins.
const GIF_SOURCES: GifSource[] = [
  { src: "/journey/media/shaan.gif" },
  { src: "/journey/media/runner.gif", poster: "/journey/media/runner-poster.png" },
];

export function JourneyCharacterMedia({
  x,
  y,
  angle,
  isPlaying,
  pathHeight,
  yOffset = 0,
  scale = 1,
  onReadyChange,
}: JourneyCharacterMediaProps) {
  const [sourceIndex, setSourceIndex] = useState(0);
  const [isReady, setIsReady] = useState(false);
  const [hasPoster, setHasPoster] = useState(true);

  const activeSource = GIF_SOURCES[sourceIndex];
  const clampedAngle = Math.max(-15, Math.min(15, angle));

  useEffect(() => {
    setIsReady(false);
    setHasPoster(Boolean(activeSource?.poster));
    onReadyChange?.(false);
  }, [activeSource?.poster, onReadyChange, sourceIndex]);

  useEffect(() => {
    return () => {
      onReadyChange?.(false);
    };
  }, [onReadyChange]);

  const handleAdvanceSource = useCallback(() => {
    setSourceIndex((current) => current + 1);
  }, []);

  const handleReady = useCallback(() => {
    setIsReady(true);
    onReadyChange?.(true);
  }, [onReadyChange]);

  if (!activeSource) return null;

  const wrapperStyle: CSSProperties = {
    left: `${x}px`,
    top: `calc(50% - ${pathHeight / 2}px + ${y + yOffset}px)`,
    transform: `translate(-50%, -50%) rotate(${clampedAngle * 0.15}deg) scale(${scale})`,
  };

  // Show poster when idle, show GIF when playing (scrolling)
  const showSrc =
    !isPlaying && hasPoster && activeSource.poster
      ? activeSource.poster
      : activeSource.src;

  return (
    <div
      className={`journey-character-media ${isReady ? "journey-character-media--ready" : ""}`}
      style={wrapperStyle}
      aria-hidden="true"
    >
      <img
        className="journey-character-media__asset"
        src={showSrc}
        alt=""
        draggable={false}
        onLoad={handleReady}
        onError={() => {
          if (!isPlaying && hasPoster && activeSource.poster) {
            setHasPoster(false);
            return;
          }
          handleAdvanceSource();
        }}
      />
    </div>
  );
}
