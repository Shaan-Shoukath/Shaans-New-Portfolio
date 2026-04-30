"use client";

import { useEffect } from "react";
import { motion, useMotionValue, useSpring } from "framer-motion";

export function ScrollProgress() {
  const progress = useMotionValue(0);
  const scaleX = useSpring(progress, {
    stiffness: 100,
    damping: 30,
    restDelta: 0.001,
  });
  useEffect(() => {
    const shell = document.getElementById("content-shell");
    if (!shell) return;

    const onScroll = () => {
      const scrollTop = shell.scrollTop;
      const scrollHeight = shell.scrollHeight - shell.clientHeight;
      progress.set(scrollHeight > 0 ? scrollTop / scrollHeight : 0);
    };

    shell.addEventListener("scroll", onScroll, { passive: true });
    return () => {
      shell.removeEventListener("scroll", onScroll);
    };
  }, [progress]);

  return (
    <motion.div
      className="fixed top-0 left-0 right-0 h-[2px] bg-gradient-to-r from-indigo-500 via-violet-500 to-purple-500 origin-left z-[60]"
      style={{ scaleX }}
    />
  );
}
