"use client";

import { useEffect } from "react";
import { createPortal } from "react-dom";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import type { Experience } from "@/lib/types";

interface JourneyModalProps {
  entry: Experience | null;
  displayIndex: number;
  onClose: () => void;
}

export function JourneyModal({ entry, displayIndex, onClose }: JourneyModalProps) {
  // ESC key to close
  useEffect(() => {
    if (!entry) return;
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", handleKey);
    return () => window.removeEventListener("keydown", handleKey);
  }, [entry, onClose]);

  // Lock body scroll while open
  useEffect(() => {
    if (entry) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [entry]);

  const modal = (
    <AnimatePresence>
      {entry && (
        <motion.div
          className="journey-modal-backdrop"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.22 }}
          onClick={onClose}
        >
          <motion.div
            className="journey-modal-panel"
            initial={{ opacity: 0, scale: 0.95, y: 16 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 16 }}
            transition={{ duration: 0.32, ease: [0.22, 1, 0.36, 1] }}
            onClick={(e) => e.stopPropagation()}
          >
            {/* Red accent line at top */}
            <div className="journey-modal-accent" />

            {/* Hero image */}
            {entry.image_url && (
              <div className="journey-modal-image">
                <Image
                  src={entry.image_url}
                  alt={entry.title}
                  fill
                  sizes="(min-width: 768px) 640px, 100vw"
                  unoptimized
                  draggable={false}
                />
                <div className="journey-modal-image__fade" />
              </div>
            )}

            <div className="journey-modal-content">
              {/* Meta row */}
              <div className="journey-modal-meta">
                <span className="journey-modal-index">
                  [{String(displayIndex).padStart(2, "0")}]
                </span>
                <span className="journey-modal-date">
                  {entry.start_date}
                  {entry.end_date ? ` — ${entry.end_date}` : " — Present"}
                </span>
                <span className="journey-modal-type">{entry.type}</span>
              </div>

              {/* Title & company */}
              <h2 className="journey-modal-title">{entry.title}</h2>
              <p className="journey-modal-company">{entry.company}</p>

              {/* Divider */}
              <div className="journey-modal-divider" />

              {/* Full description — no line clamp */}
              {entry.description && (
                <p className="journey-modal-description">{entry.description}</p>
              )}

              {/* All tags */}
              {entry.tags && entry.tags.length > 0 && (
                <div className="journey-modal-tags">
                  {entry.tags.map((tag) => (
                    <span key={tag} className="journey-modal-tag">
                      {tag}
                    </span>
                  ))}
                </div>
              )}
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );

  return createPortal(modal, document.body);
}
