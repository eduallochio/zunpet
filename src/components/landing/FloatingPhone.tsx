"use client";

import { motion, useReducedMotion } from "motion/react";
import Image from "next/image";

export function FloatingPhone({ src, alt }: { src: string; alt: string }) {
  const reduced = useReducedMotion();

  return (
    <motion.div
      className="relative select-none"
      animate={reduced ? {} : {
        y: [0, -14, 0],
        rotate: [-1.5, 1.5, -1.5],
      }}
      transition={{
        duration: 5,
        repeat: Infinity,
        ease: "easeInOut",
      }}
    >
      {/* Glow sob o celular */}
      <div
        className="absolute -bottom-8 left-1/2 -translate-x-1/2 w-48 h-12 rounded-full blur-2xl opacity-50 pointer-events-none"
        style={{ background: "oklch(0.62 0.18 174)" }}
      />

      {/* Frame do celular */}
      <div
        className="relative rounded-[2.8rem] overflow-hidden shadow-2xl"
        style={{
          width: 230,
          height: 470,
          background: "#0a0a0a",
          border: "6px solid #2a2a2a",
          boxShadow: "0 40px 80px rgba(0,0,0,0.6), inset 0 0 0 1px rgba(255,255,255,0.06)",
        }}
      >
        {/* Notch */}
        <div className="absolute top-3 left-1/2 -translate-x-1/2 w-16 h-4 bg-black rounded-full z-10" />

        {/* Screenshot */}
        <Image
          src={src}
          alt={alt}
          fill
          className="object-cover object-top"
          priority
        />

        {/* Reflexo superior */}
        <div
          className="absolute inset-0 pointer-events-none"
          style={{
            background: "linear-gradient(135deg, rgba(255,255,255,0.07) 0%, transparent 50%)",
          }}
        />
      </div>
    </motion.div>
  );
}
