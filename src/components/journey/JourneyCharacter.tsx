"use client";

interface JourneyCharacterProps {
  x: number;
  y: number;
  angle: number;
  isWalking: boolean;
  /** Scale factor, default 1 */
  scale?: number;
}

/**
 * JourneyCharacter — A walking SVG character that follows the journey path.
 *
 * The character has animated legs (CSS keyframe walk cycle) that play when
 * `isWalking` is true and pause when scroll stops (idle stance).
 *
 * Inspired by the Unseen Studio bee — lightweight SVG with internal animation.
 */
export function JourneyCharacter({
  x,
  y,
  angle,
  isWalking,
  scale = 1,
}: JourneyCharacterProps) {
  // Clamp the angle so the character doesn't flip upside down
  const clampedAngle = Math.max(-25, Math.min(25, angle));

  return (
    <g
      className="journey-character"
      transform={`translate(${x}, ${y}) scale(${scale})`}
      style={{ transition: "transform 0.15s ease-out" }}
    >
      {/* Character group — rotates slightly with path direction */}
      <g transform={`rotate(${clampedAngle * 0.3})`}>
        {/* Glow behind character */}
        <circle
          cx="0"
          cy="0"
          r="22"
          fill="rgba(220, 38, 38, 0.12)"
          className="journey-character-glow"
        />

        {/* Body */}
        <g transform="translate(-12, -24)">
          {/* Helmet / Head */}
          <circle
            cx="12"
            cy="6"
            r="7"
            fill="#1a1a1a"
            stroke="rgba(220, 38, 38, 0.6)"
            strokeWidth="1.5"
          />
          {/* Visor */}
          <ellipse
            cx="14"
            cy="5"
            rx="4"
            ry="3.5"
            fill="rgba(220, 38, 38, 0.25)"
            className="journey-character-visor"
          />
          {/* Visor shine */}
          <ellipse
            cx="15"
            cy="4"
            rx="1.5"
            ry="1"
            fill="rgba(255, 255, 255, 0.3)"
          />

          {/* Torso */}
          <rect
            x="7"
            y="12"
            width="10"
            height="12"
            rx="3"
            fill="#1a1a1a"
            stroke="rgba(220, 38, 38, 0.4)"
            strokeWidth="1"
          />
          {/* Chest detail */}
          <rect
            x="10"
            y="14"
            width="4"
            height="3"
            rx="1"
            fill="rgba(220, 38, 38, 0.3)"
          />

          {/* Left arm */}
          <line
            x1="7"
            y1="14"
            x2="2"
            y2="20"
            stroke="rgba(220, 38, 38, 0.4)"
            strokeWidth="2"
            strokeLinecap="round"
            className={isWalking ? "journey-arm-left" : ""}
          />

          {/* Right arm */}
          <line
            x1="17"
            y1="14"
            x2="22"
            y2="20"
            stroke="rgba(220, 38, 38, 0.4)"
            strokeWidth="2"
            strokeLinecap="round"
            className={isWalking ? "journey-arm-right" : ""}
          />

          {/* Left leg */}
          <line
            x1="9"
            y1="24"
            x2="6"
            y2="34"
            stroke="rgba(220, 38, 38, 0.5)"
            strokeWidth="2.5"
            strokeLinecap="round"
            className={isWalking ? "journey-leg-left" : ""}
          />

          {/* Right leg */}
          <line
            x1="15"
            y1="24"
            x2="18"
            y2="34"
            stroke="rgba(220, 38, 38, 0.5)"
            strokeWidth="2.5"
            strokeLinecap="round"
            className={isWalking ? "journey-leg-right" : ""}
          />

          {/* Jetpack / Backpack */}
          <rect
            x="3"
            y="13"
            width="4"
            height="8"
            rx="2"
            fill="#111"
            stroke="rgba(220, 38, 38, 0.3)"
            strokeWidth="0.8"
          />

          {/* Jetpack exhaust — only when walking */}
          {isWalking && (
            <g className="journey-exhaust">
              <line
                x1="5"
                y1="21"
                x2="5"
                y2="27"
                stroke="rgba(220, 38, 38, 0.4)"
                strokeWidth="1.5"
                strokeLinecap="round"
              />
              <line
                x1="4"
                y1="22"
                x2="4"
                y2="25"
                stroke="rgba(248, 113, 113, 0.3)"
                strokeWidth="1"
                strokeLinecap="round"
              />
            </g>
          )}
        </g>
      </g>

      {/* Trail particles — 3 fading dots behind the character */}
      {isWalking && (
        <>
          <circle cx={-18} cy={2} r="2" fill="rgba(220, 38, 38, 0.2)" className="journey-trail-1" />
          <circle cx={-28} cy={0} r="1.5" fill="rgba(220, 38, 38, 0.1)" className="journey-trail-2" />
          <circle cx={-36} cy={3} r="1" fill="rgba(220, 38, 38, 0.05)" className="journey-trail-3" />
        </>
      )}
    </g>
  );
}
