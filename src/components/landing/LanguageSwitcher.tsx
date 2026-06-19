"use client";

import { useEffect, useRef, useState } from "react";
import { useLocale } from "next-intl";
import { Link, usePathname } from "@/i18n/navigation";
import { routing } from "@/i18n/routing";

const LOCALE_LABELS: Record<string, string> = {
  "pt-BR": "PT",
  en: "EN",
  es: "ES",
};

const LOCALE_FLAG_CLASS: Record<string, string> = {
  "pt-BR": "fi-br",
  en: "fi-us",
  es: "fi-es",
};

export function LanguageSwitcher() {
  const locale = useLocale();
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!open) return;
    function handleClickOutside(e: MouseEvent) {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [open]);

  return (
    <div className="relative" ref={containerRef}>
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        aria-label="Switch language"
        className="flex items-center justify-center gap-1.5 h-8 px-2.5 rounded-lg text-xs font-semibold transition-all hover:scale-105"
        style={{ background: "oklch(0.16 0 0)", border: "1px solid oklch(0.24 0 0)", color: "oklch(0.80 0 0)" }}
      >
        <span className={`fi ${LOCALE_FLAG_CLASS[locale] ?? ""} rounded-[2px]`} style={{ width: "16px", height: "12px" }} />
        {LOCALE_LABELS[locale] ?? locale}
      </button>

      {open && (
        <div
          className="absolute right-0 top-full mt-2 py-1 rounded-lg overflow-hidden z-50"
          style={{ background: "oklch(0.14 0 0)", border: "1px solid oklch(0.24 0 0)", minWidth: "100px" }}
        >
          {routing.locales.map((cur) => (
            <Link
              key={cur}
              href={pathname}
              locale={cur}
              onClick={() => setOpen(false)}
              className="flex items-center gap-2 px-3 py-2 text-xs transition-colors hover:bg-white/5"
              style={{ color: cur === locale ? "oklch(0.72 0.14 174)" : "oklch(0.75 0 0)" }}
            >
              <span className={`fi ${LOCALE_FLAG_CLASS[cur] ?? ""} rounded-[2px]`} style={{ width: "16px", height: "12px" }} />
              {LOCALE_LABELS[cur] ?? cur}
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
