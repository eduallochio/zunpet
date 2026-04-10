"use client";

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
    <div
      className="group p-6 rounded-2xl h-full transition-all duration-300 cursor-default"
      style={{ background: "oklch(0.13 0 0)", border: "1px solid oklch(0.20 0 0)" }}
      onMouseEnter={(e) => {
        const el = e.currentTarget as HTMLDivElement;
        el.style.borderColor = "oklch(0.62 0.18 174 / 0.35)";
        el.style.background = "oklch(0.14 0.01 174)";
      }}
      onMouseLeave={(e) => {
        const el = e.currentTarget as HTMLDivElement;
        el.style.borderColor = "oklch(0.20 0 0)";
        el.style.background = "oklch(0.13 0 0)";
      }}
    >
      <div className="text-3xl mb-4">{emoji}</div>
      <h3 className="font-heading font-semibold text-base mb-2" style={{ color: "oklch(0.92 0 0)" }}>
        {title}
      </h3>
      <p className="text-sm leading-relaxed" style={{ color: "oklch(0.52 0 0)" }}>
        {description}
      </p>
    </div>
  );
}
