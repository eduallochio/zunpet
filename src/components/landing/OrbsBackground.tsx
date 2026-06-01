"use client";

import { motion, useReducedMotion } from "motion/react";

const ORBS = [
  { size: 500, x: "10%", y: "20%", delay: 0, duration: 12, color: "oklch(0.62 0.18 174 / 0.08)" },
  { size: 350, x: "70%", y: "10%", delay: 3, duration: 16, color: "oklch(0.62 0.18 174 / 0.05)" },
  { size: 280, x: "50%", y: "60%", delay: 6, duration: 14, color: "oklch(0.72 0.14 60 / 0.06)" },
  { size: 200, x: "85%", y: "75%", delay: 2, duration: 18, color: "oklch(0.62 0.18 174 / 0.07)" },
  { size: 160, x: "20%", y: "80%", delay: 8, duration: 10, color: "oklch(0.72 0.14 60 / 0.05)" },
];

export function OrbsBackground() {
  const reduced = useReducedMotion();

  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none" aria-hidden>
      {ORBS.map((orb, i) => (
        <motion.div
          key={i}
          className="absolute rounded-full blur-3xl"
          style={{
            width: orb.size,
            height: orb.size,
            left: orb.x,
            top: orb.y,
            background: orb.color,
            transform: "translate(-50%, -50%)",
          }}
          animate={reduced ? {} : {
            x: [0, 30, -20, 0],
            y: [0, -25, 15, 0],
            scale: [1, 1.15, 0.92, 1],
          }}
          transition={{
            duration: orb.duration,
            delay: orb.delay,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        />
      ))}
    </div>
  );
}
