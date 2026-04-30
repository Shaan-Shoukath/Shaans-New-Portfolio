"use client";

import { motion } from "framer-motion";
import Image from "next/image";
import type { Experience } from "@/lib/types";

interface JourneyNodeProps {
  experience: Experience;
  index: number;
  x: number;
  y: number;
  isActive: boolean;
}

/**
 * JourneyNode — Glassmorphism card that appears along the journey path.
 *
 * Each node transitions from dormant (dim, small) to active (full glow)
 * as the character reaches it. Shows the experience's image, title,
 * dates, description and tags.
 */
export function JourneyNode({
  experience,
  index,
  x,
  y,
  isActive,
}: JourneyNodeProps) {
  // Alternate cards above/below the path
  const isAbove = index % 2 === 0;
  const cardOffset = isAbove ? -200 : 60;

  return (
    <foreignObject
      x={x - 160}
      y={y + cardOffset}
      width="320"
      height="280"
      className="overflow-visible"
    >
      <motion.div
        className={`journey-node ${isActive ? "journey-node--active" : ""}`}
        initial={{ opacity: 0, y: isAbove ? 20 : -20, scale: 0.92 }}
        animate={{
          opacity: isActive ? 1 : 0.3,
          y: 0,
          scale: isActive ? 1 : 0.95,
        }}
        transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
      >
        {/* Connector line from path to card */}
        <div
          className={`journey-node__connector ${isAbove ? "journey-node__connector--above" : "journey-node__connector--below"}`}
        />

        {/* Phase label */}
        <div className="journey-node__phase">
          <span className="journey-node__phase-index">
            [{String(index + 1).padStart(2, "0")}]
          </span>
          <span className="journey-node__phase-date">
            {experience.start_date}
            {experience.end_date ? ` — ${experience.end_date}` : " — Present"}
          </span>
        </div>

        {/* Image */}
        {experience.image_url && (
          <div className="journey-node__image">
            <Image
              src={experience.image_url}
              alt={experience.title}
              fill
              sizes="320px"
              unoptimized
              loading="lazy"
              draggable={false}
            />
          </div>
        )}

        {/* Content */}
        <h3 className="journey-node__title">{experience.title}</h3>
        <p className="journey-node__company">{experience.company}</p>

        {experience.description && (
          <p className="journey-node__description">{experience.description}</p>
        )}

        {/* Tags */}
        {experience.tags && experience.tags.length > 0 && (
          <div className="journey-node__tags">
            {experience.tags.slice(0, 4).map((tag) => (
              <span key={tag} className="journey-node__tag">
                {tag}
              </span>
            ))}
          </div>
        )}

        {/* Type badge */}
        <div className="journey-node__type">{experience.type}</div>
      </motion.div>
    </foreignObject>
  );
}
