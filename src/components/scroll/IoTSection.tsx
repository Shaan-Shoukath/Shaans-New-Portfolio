"use client";

import { useRef } from "react";
import { motion, useScroll, useTransform } from "framer-motion";

const GPIO_PINS = [
  { label: "3.3V", color: "#EF4444", x: 82, y: 30 },
  { label: "5V", color: "#F59E0B", x: 94, y: 30 },
  { label: "GPIO2", color: "#10B981", x: 82, y: 40 },
  { label: "5V", color: "#F59E0B", x: 94, y: 40 },
  { label: "GPIO3", color: "#10B981", x: 82, y: 50 },
  { label: "GND", color: "#6B7280", x: 94, y: 50 },
  { label: "GPIO4", color: "#10B981", x: 82, y: 60 },
  { label: "TX", color: "#818CF8", x: 94, y: 60 },
  { label: "GND", color: "#6B7280", x: 82, y: 70 },
  { label: "RX", color: "#A78BFA", x: 94, y: 70 },
];

export function IoTSection() {
  const containerRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start end", "end start"],
  });

  const boardOpacity = useTransform(scrollYProgress, [0.1, 0.3], [0, 1]);
  const boardScale = useTransform(scrollYProgress, [0.1, 0.3], [0.9, 1]);
  const lineOpacity = useTransform(scrollYProgress, [0.4, 0.55], [0, 0.6]);

  return (
    <section
      ref={containerRef}
      className="relative h-screen overflow-hidden flex items-center justify-center"
    >
      <div className="absolute inset-0 bg-gradient-to-b from-[#0B0F19] via-[#0d1520] to-[#0B0F19]" />

      {/* Circuit board pattern */}
      <div className="absolute inset-0 opacity-[0.02]">
        <svg className="w-full h-full" xmlns="http://www.w3.org/2000/svg">
          <pattern id="circuit" x="0" y="0" width="100" height="100" patternUnits="userSpaceOnUse">
            <path d="M 0 50 L 30 50 L 30 30 L 70 30 L 70 50 L 100 50" fill="none" stroke="white" strokeWidth="0.5" />
            <path d="M 50 0 L 50 30" fill="none" stroke="white" strokeWidth="0.5" />
            <path d="M 50 70 L 50 100" fill="none" stroke="white" strokeWidth="0.5" />
            <circle cx="30" cy="30" r="2" fill="white" />
            <circle cx="70" cy="30" r="2" fill="white" />
            <circle cx="50" cy="70" r="2" fill="white" />
          </pattern>
          <rect width="100%" height="100%" fill="url(#circuit)" />
        </svg>
      </div>

      {/* Raspberry Pi Board */}
      <motion.div
        className="relative z-10"
        style={{ opacity: boardOpacity, scale: boardScale }}
      >
        <svg
          width="320"
          height="210"
          viewBox="0 0 320 210"
          fill="none"
          className="drop-shadow-2xl"
        >
          {/* Board */}
          <rect x="10" y="10" width="300" height="190" rx="8" fill="#1a5e1a" stroke="#2d8e2d" strokeWidth="1.5" />

          {/* Mounting holes */}
          <circle cx="30" cy="30" r="4" fill="#333" stroke="#555" />
          <circle cx="290" cy="30" r="4" fill="#333" stroke="#555" />
          <circle cx="30" cy="180" r="4" fill="#333" stroke="#555" />
          <circle cx="290" cy="180" r="4" fill="#333" stroke="#555" />

          {/* CPU chip */}
          <rect x="120" y="70" width="60" height="60" rx="4" fill="#222" stroke="#444" />
          <text x="150" y="105" textAnchor="middle" fill="#888" fontSize="8" fontFamily="monospace">
            BCM2837
          </text>

          {/* USB ports */}
          <rect x="260" y="90" width="48" height="25" rx="2" fill="#888" stroke="#666" strokeWidth="1" />
          <rect x="260" y="120" width="48" height="25" rx="2" fill="#888" stroke="#666" strokeWidth="1" />

          {/* Ethernet */}
          <rect x="260" y="40" width="48" height="40" rx="2" fill="#999" stroke="#777" strokeWidth="1" />

          {/* HDMI */}
          <rect x="90" y="190" width="35" height="12" rx="2" fill="#444" stroke="#666" />

          {/* SD Card */}
          <rect x="0" y="100" width="15" height="22" rx="1" fill="#555" stroke="#777" />

          {/* GPIO Header */}
          <rect x="40" y="20" width="200" height="12" rx="1" fill="#333" />
          {[...Array(20)].map((_, i) => (
            <g key={i}>
              <rect
                x={48 + i * 10}
                y={22}
                width="4"
                height="8"
                fill="#C4A000"
                rx="0.5"
              />
            </g>
          ))}

          {/* Power LED */}
          <motion.circle
            cx="50" cy="170" r="3" fill="#EF4444"
            animate={{ opacity: [0.4, 1, 0.4] }}
            transition={{ duration: 2, repeat: Infinity }}
          />
          <text x="58" y="173" fill="#888" fontSize="6" fontFamily="monospace">PWR</text>

          {/* Activity LED */}
          <motion.circle
            cx="50" cy="155" r="3" fill="#10B981"
            animate={{ opacity: [0.2, 1, 0.2] }}
            transition={{ duration: 0.3, repeat: Infinity }}
          />
          <text x="58" y="158" fill="#888" fontSize="6" fontFamily="monospace">ACT</text>

          {/* PCB traces */}
          <motion.g style={{ opacity: lineOpacity }}>
            <path d="M 180 100 L 260 100" stroke="#C4A000" strokeWidth="0.5" opacity="0.5" />
            <path d="M 150 130 L 150 190" stroke="#C4A000" strokeWidth="0.5" opacity="0.5" />
            <path d="M 120 85 L 50 85 L 50 155" stroke="#C4A000" strokeWidth="0.5" opacity="0.5" />
          </motion.g>
        </svg>

        {/* GPIO Labels */}
        <div className="absolute -right-36 top-2 space-y-0.5">
          {GPIO_PINS.slice(0, 5).map((pin, i) => (
            <motion.div
              key={i}
              className="flex items-center gap-2 text-[10px] font-mono text-muted-foreground"
              initial={{ opacity: 0, x: -10 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.5 + i * 0.1 }}
              viewport={{ once: true }}
            >
              <div className="w-2 h-2 rounded-full" style={{ backgroundColor: pin.color }} />
              <span>{pin.label}</span>
            </motion.div>
          ))}
        </div>
      </motion.div>

      {/* Label */}
      <div className="absolute inset-0 flex items-end justify-center z-20 pb-16">
        <div className="text-center">
          <motion.h2
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
            className="text-4xl md:text-6xl font-bold font-[family-name:var(--font-heading)] mb-2"
          >
            <span className="gradient-text">IoT & Embedded</span>
          </motion.h2>
          <motion.p
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            transition={{ delay: 0.3 }}
            viewport={{ once: true }}
            className="text-muted-foreground"
          >
            Connecting the physical and digital worlds
          </motion.p>
        </div>
      </div>
    </section>
  );
}
