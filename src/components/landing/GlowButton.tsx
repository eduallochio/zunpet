"use client";

import { motion, useReducedMotion } from "motion/react";
import { ReactNode } from "react";

interface GlowButtonProps {
  children: ReactNode;
  href?: string;
  onClick?: () => void;
  className?: string;
  size?: "sm" | "md" | "lg";
}

export function GlowButton({ children, href, onClick, className = "", size = "md" }: GlowButtonProps) {
  const reduced = useReducedMotion();

  const sizeClasses = {
    sm: "px-4 py-2 text-sm",
    md: "px-6 py-3 text-sm",
    lg: "px-8 py-4 text-base",
  };

  const inner = (
    <motion.span
      className={`relative inline-flex items-center gap-2 font-semibold rounded-xl overflow-hidden ${sizeClasses[size]} ${className}`}
      style={{ background: "oklch(0.62 0.18 174)", color: "#fff" }}
      whileHover={reduced ? {} : { scale: 1.04 }}
      whileTap={reduced ? {} : { scale: 0.97 }}
    >
      {/* Glow pulsante */}
      {!reduced && (
        <motion.span
          className="absolute inset-0 rounded-xl pointer-events-none"
          style={{ background: "oklch(0.62 0.18 174)" }}
          animate={{ opacity: [0.4, 0.8, 0.4], scale: [1, 1.06, 1] }}
          transition={{ duration: 2.5, repeat: Infinity, ease: "easeInOut" }}
        />
      )}

      {/* Shine sweep */}
      {!reduced && (
        <motion.span
          className="absolute inset-0 pointer-events-none"
          style={{
            background: "linear-gradient(105deg, transparent 30%, rgba(255,255,255,0.18) 50%, transparent 70%)",
          }}
          animate={{ x: ["-100%", "200%"] }}
          transition={{ duration: 2.5, repeat: Infinity, ease: "linear", repeatDelay: 1 }}
        />
      )}

      <span className="relative z-10">{children}</span>
    </motion.span>
  );

  if (href) {
    return <a href={href}>{inner}</a>;
  }
  return <button onClick={onClick}>{inner}</button>;
}
