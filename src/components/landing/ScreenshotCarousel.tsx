"use client";

import { useState, useEffect, useCallback } from "react";
import Image from "next/image";
import useEmblaCarousel from "embla-carousel-react";
import { motion, AnimatePresence } from "motion/react";
import { ChevronLeft, ChevronRight, X } from "lucide-react";

const SCREENSHOTS = [
  { src: "/screenshots/login.png",             label: "Login"              },
  { src: "/screenshots/meus-pets.png",         label: "Meus Pets"          },
  { src: "/screenshots/perfil-pet.png",        label: "Perfil do Pet"      },
  { src: "/screenshots/passaporte.png",        label: "Passaporte"         },
  { src: "/screenshots/novo-pet.png",          label: "Novo Pet"           },
  { src: "/screenshots/agenda.png",            label: "Agenda"             },
  { src: "/screenshots/novo-lembrete.png",     label: "Lembretes"          },
  { src: "/screenshots/notificacoes.png",      label: "Notificações"       },
  { src: "/screenshots/estatisticas.png",      label: "Estatísticas"       },
  { src: "/screenshots/conquistas.png",        label: "Conquistas"         },
  { src: "/screenshots/servicos-proximos.png", label: "Serviços Próximos"  },
  { src: "/screenshots/perfil.png",            label: "Perfil"             },
];

export default function ScreenshotCarousel() {
  const [mounted, setMounted] = useState(false);
  const [lightbox, setLightbox] = useState<number | null>(null);
  const [selectedIndex, setSelectedIndex] = useState(0);

  // Embla para o carrossel principal
  const [emblaRef, emblaApi] = useEmblaCarousel({
    loop: true,
    align: "center",
    skipSnaps: false,
    dragFree: false,
  });

  const onSelect = useCallback(() => {
    if (!emblaApi) return;
    setSelectedIndex(emblaApi.selectedScrollSnap());
  }, [emblaApi]);

  useEffect(() => {
    if (!emblaApi) return;
    emblaApi.on("select", onSelect);
    onSelect();
  }, [emblaApi, onSelect]);

  // Autoplay
  useEffect(() => {
    if (!emblaApi) return;
    const id = setInterval(() => emblaApi.scrollNext(), 3000);
    return () => clearInterval(id);
  }, [emblaApi]);

  const scrollPrev = useCallback(() => emblaApi?.scrollPrev(), [emblaApi]);
  const scrollNext = useCallback(() => emblaApi?.scrollNext(), [emblaApi]);

  // Lightbox
  const prevLightbox = useCallback(() =>
    setLightbox(i => i === null ? null : (i - 1 + SCREENSHOTS.length) % SCREENSHOTS.length), []);
  const nextLightbox = useCallback(() =>
    setLightbox(i => i === null ? null : (i + 1) % SCREENSHOTS.length), []);
  const closeLightbox = useCallback(() => setLightbox(null), []);

  useEffect(() => {
    if (!mounted || lightbox === null) return;
    const handler = (e: KeyboardEvent) => {
      if (e.key === "ArrowLeft")  prevLightbox();
      if (e.key === "ArrowRight") nextLightbox();
      if (e.key === "Escape")     closeLightbox();
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [mounted, lightbox, prevLightbox, nextLightbox, closeLightbox]);

  useEffect(() => {
    if (!mounted) return;
    document.body.style.overflow = lightbox !== null ? "hidden" : "";
    return () => { document.body.style.overflow = ""; };
  }, [lightbox, mounted]);

  useEffect(() => { setMounted(true); }, []);

  return (
    <>
      {/* ── Carrossel Embla ──────────────────────────────────────────────── */}
      <div className="relative">

        {/* Setas */}
        <button
          onClick={scrollPrev}
          className="absolute left-0 top-1/2 -translate-y-1/2 -translate-x-3 z-10 w-9 h-9 rounded-full flex items-center justify-center transition-all hover:scale-110 hidden md:flex"
          style={{ background: "oklch(0.20 0 0)", border: "1px solid oklch(0.28 0 0)", color: "oklch(0.75 0 0)" }}
        >
          <ChevronLeft size={18} />
        </button>
        <button
          onClick={scrollNext}
          className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-3 z-10 w-9 h-9 rounded-full flex items-center justify-center transition-all hover:scale-110 hidden md:flex"
          style={{ background: "oklch(0.20 0 0)", border: "1px solid oklch(0.28 0 0)", color: "oklch(0.75 0 0)" }}
        >
          <ChevronRight size={18} />
        </button>

        {/* Fade nas bordas */}
        <div className="absolute left-0 top-0 bottom-0 w-16 z-10 pointer-events-none"
          style={{ background: "linear-gradient(to right, oklch(0.10 0 0), transparent)" }} />
        <div className="absolute right-0 top-0 bottom-0 w-16 z-10 pointer-events-none"
          style={{ background: "linear-gradient(to left, oklch(0.10 0 0), transparent)" }} />

        {/* Viewport Embla */}
        <div ref={emblaRef} className="overflow-hidden">
          <div className="flex gap-5 md:gap-7 py-8">
            {SCREENSHOTS.map((s, i) => {
              const isActive = i === selectedIndex;
              return (
                <motion.div
                  key={s.src}
                  className="flex-none cursor-pointer select-none"
                  style={{ width: "clamp(200px, 38vw, 260px)" }}
                  animate={{
                    scale: isActive ? 1 : 0.85,
                    opacity: isActive ? 1 : 0.45,
                  }}
                  transition={{ type: "spring", stiffness: 300, damping: 30 }}
                  onClick={() => {
                    if (isActive) {
                      setLightbox(i);
                    } else {
                      emblaApi?.scrollTo(i);
                    }
                  }}
                >
                  <div
                    className="relative w-full overflow-hidden"
                    style={{
                      aspectRatio: "9/19.5",
                      borderRadius: "24px",
                      border: isActive
                        ? "1.5px solid oklch(0.62 0.18 174 / 0.6)"
                        : "1px solid oklch(0.22 0 0)",
                      boxShadow: isActive
                        ? "0 0 40px oklch(0.62 0.18 174 / 0.2), 0 20px 50px oklch(0 0 0 / 0.6)"
                        : "0 8px 24px oklch(0 0 0 / 0.4)",
                    }}
                  >
                    <Image
                      src={s.src}
                      alt={`Zupet — ${s.label}`}
                      fill
                      className="object-cover object-top"
                      sizes="(max-width: 768px) 38vw, 260px"
                    />
                    {/* Overlay expand no active */}
                    {isActive && (
                      <div className="absolute inset-0 opacity-0 hover:opacity-100 transition-opacity duration-200 flex items-center justify-center"
                        style={{ background: "oklch(0 0 0 / 0.3)" }}>
                        <div className="w-9 h-9 rounded-full flex items-center justify-center"
                          style={{ background: "oklch(0.62 0.18 174 / 0.9)" }}>
                          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5">
                            <path d="M15 3h6v6M9 21H3v-6M21 3l-7 7M3 21l7-7" />
                          </svg>
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Label */}
                  <motion.p
                    className="text-center text-xs mt-2.5 font-medium"
                    animate={{ color: isActive ? "oklch(0.80 0 0)" : "oklch(0.40 0 0)" }}
                    transition={{ duration: 0.2 }}
                  >
                    {s.label}
                  </motion.p>
                </motion.div>
              );
            })}
          </div>
        </div>

        {/* Dots */}
        <div className="flex justify-center gap-1.5 mt-4">
          {SCREENSHOTS.map((_, i) => (
            <button
              key={i}
              onClick={() => emblaApi?.scrollTo(i)}
              className="transition-all duration-300"
              style={{
                width: i === selectedIndex ? "20px" : "6px",
                height: "6px",
                borderRadius: "3px",
                background: i === selectedIndex
                  ? "oklch(0.62 0.18 174)"
                  : "oklch(0.25 0 0)",
              }}
            />
          ))}
        </div>
      </div>

      {/* ── Lightbox ─────────────────────────────────────────────────────── */}
      <AnimatePresence>
        {mounted && lightbox !== null && (
          <motion.div
            key="lightbox"
            className="fixed inset-0 z-50 flex items-center justify-center"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            style={{ background: "oklch(0 0 0 / 0.93)", backdropFilter: "blur(16px)" }}
            onClick={closeLightbox}
          >
            {/* Fechar */}
            <button
              onClick={closeLightbox}
              className="absolute top-5 right-5 w-10 h-10 rounded-full flex items-center justify-center z-10 transition-colors hover:bg-white/10"
              style={{ background: "oklch(0.18 0 0)", color: "oklch(0.75 0 0)" }}
            >
              <X size={18} />
            </button>

            {/* Contador */}
            <div className="absolute top-5 left-1/2 -translate-x-1/2 text-xs font-mono px-3 py-1.5 rounded-full"
              style={{ background: "oklch(0.16 0 0)", color: "oklch(0.55 0 0)", border: "1px solid oklch(0.22 0 0)" }}>
              {String(lightbox + 1).padStart(2, "0")} / {String(SCREENSHOTS.length).padStart(2, "0")}
            </div>

            {/* Seta esquerda */}
            <button
              onClick={e => { e.stopPropagation(); prevLightbox(); }}
              className="absolute left-4 md:left-10 w-11 h-11 rounded-full flex items-center justify-center z-10 transition-all hover:scale-110"
              style={{ background: "oklch(0.18 0 0)", border: "1px solid oklch(0.26 0 0)", color: "oklch(0.80 0 0)" }}
            >
              <ChevronLeft size={20} />
            </button>

            {/* Imagem */}
            <motion.div
              key={lightbox}
              className="relative mx-20 md:mx-28"
              style={{ width: "min(300px, 65vw)", aspectRatio: "9/19.5" }}
              initial={{ scale: 0.88, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.88, opacity: 0 }}
              transition={{ type: "spring", stiffness: 320, damping: 28 }}
              onClick={e => e.stopPropagation()}
            >
              {/* Glow */}
              <div className="absolute inset-0 rounded-[32px] pointer-events-none"
                style={{ boxShadow: "0 0 80px oklch(0.62 0.18 174 / 0.3), 0 40px 80px oklch(0 0 0 / 0.7)" }} />
              <div className="relative w-full h-full overflow-hidden" style={{ borderRadius: "32px", border: "1.5px solid oklch(0.62 0.18 174 / 0.35)" }}>
                <Image
                  src={SCREENSHOTS[lightbox].src}
                  alt={`Zupet — ${SCREENSHOTS[lightbox].label}`}
                  fill
                  className="object-cover object-top"
                  sizes="(max-width: 768px) 65vw, 300px"
                  priority
                />
              </div>
              {/* Label */}
              <p className="absolute -bottom-9 left-0 right-0 text-center text-sm font-medium"
                style={{ color: "oklch(0.70 0 0)" }}>
                {SCREENSHOTS[lightbox].label}
              </p>
            </motion.div>

            {/* Seta direita */}
            <button
              onClick={e => { e.stopPropagation(); nextLightbox(); }}
              className="absolute right-4 md:right-10 w-11 h-11 rounded-full flex items-center justify-center z-10 transition-all hover:scale-110"
              style={{ background: "oklch(0.18 0 0)", border: "1px solid oklch(0.26 0 0)", color: "oklch(0.80 0 0)" }}
            >
              <ChevronRight size={20} />
            </button>

            {/* Dots */}
            <div className="absolute bottom-7 left-1/2 -translate-x-1/2 flex gap-1.5">
              {SCREENSHOTS.map((_, i) => (
                <button
                  key={i}
                  onClick={e => { e.stopPropagation(); setLightbox(i); }}
                  className="transition-all duration-300"
                  style={{
                    width: i === lightbox ? "20px" : "6px",
                    height: "6px",
                    borderRadius: "3px",
                    background: i === lightbox ? "oklch(0.62 0.18 174)" : "oklch(0.30 0 0)",
                  }}
                />
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
