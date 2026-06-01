"use client";

import { TiltCard } from "./TiltCard";

export function FeatureCard({
  emoji,
  title,
  description,
}: {
  emoji: string;
  title: string;
  description: string;
}) {
  return (
    <TiltCard className="group h-full">
      <div
        className="p-6 rounded-2xl h-full transition-all duration-300"
        style={{ background: "oklch(0.13 0 0)", border: "1px solid oklch(0.20 0 0)" }}
        onMouseEnter={(e) => {
          const el = e.currentTarget as HTMLDivElement;
          el.style.borderColor = "oklch(0.62 0.18 174 / 0.4)";
          el.style.background = "oklch(0.145 0.015 174)";
        }}
        onMouseLeave={(e) => {
          const el = e.currentTarget as HTMLDivElement;
          el.style.borderColor = "oklch(0.20 0 0)";
          el.style.background = "oklch(0.13 0 0)";
        }}
      >
        {/* Emoji com fundo */}
        <div
          className="w-12 h-12 rounded-xl flex items-center justify-center text-2xl mb-4 transition-transform duration-300 group-hover:scale-110"
          style={{ background: "oklch(0.18 0.02 174)" }}
        >
          {emoji}
        </div>

        <h3 className="font-heading font-semibold text-base mb-2" style={{ color: "oklch(0.92 0 0)" }}>
          {title}
        </h3>
        <p className="text-sm leading-relaxed" style={{ color: "oklch(0.52 0 0)" }}>
          {description}
        </p>

        {/* Bottom accent line ao hover */}
        <div
          className="mt-4 h-px w-0 group-hover:w-full transition-all duration-500 rounded-full"
          style={{ background: "oklch(0.62 0.18 174 / 0.4)" }}
        />
      </div>
    </TiltCard>
  );
}
