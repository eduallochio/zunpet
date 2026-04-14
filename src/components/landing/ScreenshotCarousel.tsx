"use client";

import { useState, useEffect, useCallback } from "react";
import Image from "next/image";
import { ChevronLeft, ChevronRight, X } from "lucide-react";

const SCREENSHOTS = [
  { src: "/screenshots/login.png",             label: "Login",               num: "01" },
  { src: "/screenshots/meus-pets.png",         label: "Meus Pets",           num: "02" },
  { src: "/screenshots/perfil-pet.png",        label: "Perfil do Pet",       num: "03" },
  { src: "/screenshots/passaporte.png",        label: "Passaporte",          num: "04" },
  { src: "/screenshots/novo-pet.png",          label: "Novo Pet",            num: "05" },
  { src: "/screenshots/agenda.png",            label: "Agenda",              num: "06" },
  { src: "/screenshots/novo-lembrete.png",     label: "Lembretes",           num: "07" },
  { src: "/screenshots/notificacoes.png",      label: "Notificações",        num: "08" },
  { src: "/screenshots/estatisticas.png",      label: "Estatísticas",        num: "09" },
  { src: "/screenshots/conquistas.png",        label: "Conquistas",          num: "10" },
  { src: "/screenshots/servicos-proximos.png", label: "Serviços Próximos",   num: "11" },
  { src: "/screenshots/perfil.png",            label: "Perfil",              num: "12" },
];

export default function ScreenshotCarousel() {
  const [lightbox, setLightbox] = useState<number | null>(null);

  const prev = useCallback(() => {
    setLightbox(i => i === null ? null : (i - 1 + SCREENSHOTS.length) % SCREENSHOTS.length);
  }, []);

  const next = useCallback(() => {
    setLightbox(i => i === null ? null : (i + 1) % SCREENSHOTS.length);
  }, []);

  const close = useCallback(() => setLightbox(null), []);

  // Teclado
  useEffect(() => {
    if (lightbox === null) return;
    const handler = (e: KeyboardEvent) => {
      if (e.key === "ArrowLeft")  prev();
      if (e.key === "ArrowRight") next();
      if (e.key === "Escape")     close();
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [lightbox, prev, next, close]);

  // Bloqueia scroll quando lightbox aberto
  useEffect(() => {
    document.body.style.overflow = lightbox !== null ? "hidden" : "";
    return () => { document.body.style.overflow = ""; };
  }, [lightbox]);

  return (
    <>
      {/* ── Grid de screenshots ── */}
      <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-6 gap-3 md:gap-4">
        {SCREENSHOTS.map((s, i) => (
          <button
            key={s.src}
            onClick={() => setLightbox(i)}
            className="group flex flex-col gap-2 focus:outline-none"
            style={{ marginTop: i % 3 === 1 ? "24px" : i % 3 === 2 ? "12px" : "0px" }}
          >
            <div
              className="relative w-full overflow-hidden transition-all duration-300 group-hover:scale-[1.03] group-hover:shadow-2xl"
              style={{
                borderRadius: "20px",
                aspectRatio: "9/19.5",
                border: "1px solid oklch(0.28 0 0)",
                boxShadow: "0 16px 40px oklch(0 0 0 / 0.5)",
              }}
            >
              <Image
                src={s.src}
                alt={`Zupet — ${s.label}`}
                fill
                className="object-cover object-top"
                sizes="(max-width: 640px) 33vw, (max-width: 768px) 25vw, 17vw"
              />
              {/* overlay ao hover */}
              <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-200 flex items-center justify-center"
                style={{ background: "oklch(0 0 0 / 0.35)" }}>
                <div className="w-10 h-10 rounded-full flex items-center justify-center"
                  style={{ background: "oklch(0.62 0.18 174 / 0.9)" }}>
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5">
                    <path d="M15 3h6v6M9 21H3v-6M21 3l-7 7M3 21l7-7" />
                  </svg>
                </div>
              </div>
            </div>
            <div className="flex items-center justify-between px-0.5">
              <span className="text-xs font-medium truncate" style={{ color: "oklch(0.65 0 0)" }}>{s.label}</span>
              <span className="text-xs font-mono flex-shrink-0" style={{ color: "oklch(0.45 0 0)" }}>{s.num}</span>
            </div>
          </button>
        ))}
      </div>

      {/* ── Lightbox ── */}
      {lightbox !== null && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center"
          style={{ background: "oklch(0 0 0 / 0.92)", backdropFilter: "blur(12px)" }}
          onClick={close}
        >
          {/* Fechar */}
          <button
            onClick={close}
            className="absolute top-5 right-5 w-10 h-10 rounded-full flex items-center justify-center transition-colors z-10"
            style={{ background: "oklch(0.20 0 0)", color: "oklch(0.80 0 0)" }}
          >
            <X size={18} />
          </button>

          {/* Contador */}
          <div className="absolute top-5 left-1/2 -translate-x-1/2 text-xs font-mono px-3 py-1.5 rounded-full"
            style={{ background: "oklch(0.18 0 0)", color: "oklch(0.60 0 0)" }}>
            {SCREENSHOTS[lightbox].num} / {SCREENSHOTS.length.toString().padStart(2, "0")}
          </div>

          {/* Seta esquerda */}
          <button
            onClick={e => { e.stopPropagation(); prev(); }}
            className="absolute left-4 md:left-8 w-11 h-11 rounded-full flex items-center justify-center transition-all hover:scale-110 z-10"
            style={{ background: "oklch(0.20 0 0)", color: "oklch(0.85 0 0)" }}
          >
            <ChevronLeft size={22} />
          </button>

          {/* Imagem central */}
          <div
            className="relative mx-16 md:mx-24"
            style={{ width: "min(240px, 55vw)", aspectRatio: "9/19.5" }}
            onClick={e => e.stopPropagation()}
          >
            <div className="absolute inset-0 rounded-[32px]"
              style={{ boxShadow: "0 0 80px oklch(0.62 0.18 174 / 0.25), 0 40px 80px oklch(0 0 0 / 0.7)" }} />
            <div className="w-full h-full overflow-hidden" style={{ borderRadius: "32px", border: "1px solid oklch(0.30 0 0)" }}>
              <Image
                key={lightbox}
                src={SCREENSHOTS[lightbox].src}
                alt={`Zupet — ${SCREENSHOTS[lightbox].label}`}
                fill
                className="object-cover object-top"
                sizes="240px"
                priority
              />
            </div>
            {/* Label */}
            <div className="absolute -bottom-10 left-0 right-0 text-center">
              <span className="text-sm font-medium" style={{ color: "oklch(0.75 0 0)" }}>
                {SCREENSHOTS[lightbox].label}
              </span>
            </div>
          </div>

          {/* Seta direita */}
          <button
            onClick={e => { e.stopPropagation(); next(); }}
            className="absolute right-4 md:right-8 w-11 h-11 rounded-full flex items-center justify-center transition-all hover:scale-110 z-10"
            style={{ background: "oklch(0.20 0 0)", color: "oklch(0.85 0 0)" }}
          >
            <ChevronRight size={22} />
          </button>

          {/* Thumbnails */}
          <div className="absolute bottom-6 left-1/2 -translate-x-1/2 flex gap-1.5">
            {SCREENSHOTS.map((_, i) => (
              <button
                key={i}
                onClick={e => { e.stopPropagation(); setLightbox(i); }}
                className="transition-all duration-200"
                style={{
                  width: i === lightbox ? "20px" : "6px",
                  height: "6px",
                  borderRadius: "3px",
                  background: i === lightbox ? "oklch(0.62 0.18 174)" : "oklch(0.35 0 0)",
                }}
              />
            ))}
          </div>
        </div>
      )}
    </>
  );
}
