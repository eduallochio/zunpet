"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useState, useRef } from "react";
import { TrackPageView, TrackableStoreLink } from "@/components/landing/TrackingProvider";

const GOOGLE_PLAY_URL = "https://play.google.com/store/apps/details?id=io.zupet.app&hl=pt_BR";
const APP_STORE_URL = "https://apps.apple.com/app/zupet/id0000000000"; // placeholder até publicar

const SCREENSHOTS = [
  { src: "perfil-pet.png", label: "Perfil do Pet" },
  { src: "agenda.png",     label: "Agenda & Lembretes" },
  { src: "conquistas.png", label: "Conquistas" },
];

type Platform = "android" | "ios" | "unknown";

function detectPlatform(): Platform {
  if (typeof navigator === "undefined") return "unknown";
  const ua = navigator.userAgent.toLowerCase();
  if (/android/.test(ua)) return "android";
  if (/iphone|ipad|ipod/.test(ua)) return "ios";
  return "unknown";
}

function PhoneMockup({ index, onNext, onPrev }: { index: number; onNext: () => void; onPrev: () => void }) {
  const touchStartX = useRef<number | null>(null);

  const handleTouchStart = (e: React.TouchEvent) => {
    touchStartX.current = e.touches[0].clientX;
  };

  const handleTouchEnd = (e: React.TouchEvent) => {
    if (touchStartX.current === null) return;
    const diff = touchStartX.current - e.changedTouches[0].clientX;
    if (Math.abs(diff) > 40) diff > 0 ? onNext() : onPrev();
    touchStartX.current = null;
  };

  return (
    <div className="flex flex-col items-center gap-4 mb-8">
      {/* Frame do celular */}
      <div
        className="relative"
        style={{ width: 200, height: 420 }}
        onTouchStart={handleTouchStart}
        onTouchEnd={handleTouchEnd}
      >
        {/* Corpo do celular */}
        <div className="absolute inset-0 rounded-[36px] border-[6px] border-white/20 bg-[#0d1117] shadow-[0_0_40px_rgba(45,212,191,0.15)] overflow-hidden">
          {/* Notch */}
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-20 h-5 bg-black rounded-b-2xl z-10" />
          {/* Screenshot */}
          <Image
            key={SCREENSHOTS[index].src}
            src={`/screenshots/${SCREENSHOTS[index].src}`}
            alt={SCREENSHOTS[index].label}
            fill
            className="object-cover transition-opacity duration-300"
            sizes="200px"
          />
        </div>
        {/* Botão lateral (power) */}
        <div className="absolute right-[-8px] top-24 w-1.5 h-10 bg-white/20 rounded-full" />
        {/* Botões de volume */}
        <div className="absolute left-[-8px] top-20 w-1.5 h-7 bg-white/20 rounded-full" />
        <div className="absolute left-[-8px] top-32 w-1.5 h-7 bg-white/20 rounded-full" />
      </div>

      {/* Label + dots */}
      <p className="text-xs text-gray-400" style={{ fontFamily: "var(--font-jakarta)" }}>
        {SCREENSHOTS[index].label}
      </p>
      <div className="flex gap-2">
        {SCREENSHOTS.map((_, i) => (
          <button
            key={i}
            onClick={i < index ? onPrev : onNext}
            className={`w-2 h-2 rounded-full transition-all duration-200 ${i === index ? "bg-teal-400 w-4" : "bg-white/20"}`}
          />
        ))}
      </div>
    </div>
  );
}

export default function DownloadPage() {
  const [platform, setPlatform] = useState<Platform>("unknown");
  const [countdown, setCountdown] = useState<number | null>(null);
  const [screenshotIndex, setScreenshotIndex] = useState(0);

  const next = () => setScreenshotIndex((i) => (i + 1) % SCREENSHOTS.length);
  const prev = () => setScreenshotIndex((i) => (i - 1 + SCREENSHOTS.length) % SCREENSHOTS.length);

  useEffect(() => {
    const p = detectPlatform();
    setPlatform(p);

    const storeUrl = p === "android" ? GOOGLE_PLAY_URL : p === "ios" ? APP_STORE_URL : null;
    if (!storeUrl) return;

    setCountdown(5);
    const tick = setInterval(() => {
      setCountdown((c) => {
        if (c === null || c <= 1) {
          clearInterval(tick);
          window.location.href = storeUrl;
          return null;
        }
        return c - 1;
      });
    }, 1000);
    return () => clearInterval(tick);
  }, []);

  // Autoplay do carrossel
  useEffect(() => {
    const interval = setInterval(next, 3000);
    return () => clearInterval(interval);
  }, []);

  return (
    <main className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-[#0d1117] via-[#0f1f2e] to-[#0d1117] px-6 py-12">
      <TrackPageView />
      {/* Logo */}
      <div className="flex flex-col items-center gap-4 mb-10">
        <Image
          src="/icon.png"
          alt="Zupet"
          width={80}
          height={80}
          className="rounded-2xl shadow-lg"
        />
        <h1 className="text-3xl font-bold text-white" style={{ fontFamily: "var(--font-bricolage)" }}>
          Zupet
        </h1>
        <p className="text-center text-gray-400 text-sm max-w-xs" style={{ fontFamily: "var(--font-jakarta)" }}>
          O app completo para cuidar do seu pet
        </p>
      </div>

      {/* Countdown redirect */}
      {countdown !== null && (
        <div className="mb-6 w-full max-w-xs flex flex-col gap-2" style={{ fontFamily: "var(--font-jakarta)" }}>
          <div className="flex items-center justify-between text-xs text-gray-400">
            <span className="flex items-center gap-1.5">
              <span className="inline-block w-2 h-2 rounded-full bg-teal-400 animate-pulse" />
              {platform === "android" ? "Abrindo Google Play" : "Abrindo App Store"} em {countdown}s…
            </span>
            <button
              onClick={() => setCountdown(null)}
              className="text-gray-600 hover:text-gray-400 transition-colors"
            >
              cancelar
            </button>
          </div>
          <div className="w-full h-1 bg-white/10 rounded-full overflow-hidden">
            <div
              className="h-full bg-teal-400 rounded-full transition-all duration-1000 ease-linear"
              style={{ width: `${((5 - countdown) / 5) * 100}%` }}
            />
          </div>
        </div>
      )}

      {/* Phone mockup */}
      <PhoneMockup index={screenshotIndex} onNext={next} onPrev={prev} />

      {/* Botões */}
      <div className="flex flex-col gap-4 w-full max-w-xs">
        {/* Google Play */}
        <TrackableStoreLink
          store="android"
          href={GOOGLE_PLAY_URL}
          target="_blank"
          rel="noopener noreferrer"
          className={`flex items-center justify-center gap-3 rounded-2xl px-6 py-4 transition-all duration-200 border ${
            platform === "android"
              ? "bg-teal-500 border-teal-400 shadow-[0_0_24px_rgba(45,212,191,0.4)] scale-105"
              : "bg-white/5 border-white/10 hover:bg-white/10 hover:border-white/20"
          }`}
        >
          <Image src="/stores/google-play.png" alt="Google Play" width={120} height={36} className="h-8 w-auto" />
          {platform === "android" && (
            <span className="text-xs text-white/80 font-medium" style={{ fontFamily: "var(--font-jakarta)" }}>
              Disponível
            </span>
          )}
        </TrackableStoreLink>

        {/* App Store */}
        <div
          className={`flex flex-col items-center gap-2 rounded-2xl px-6 py-4 border transition-all duration-200 ${
            platform === "ios"
              ? "bg-white/10 border-white/20 shadow-[0_0_24px_rgba(255,255,255,0.1)] scale-105"
              : "bg-white/5 border-white/10 opacity-60"
          }`}
        >
          <Image src="/stores/app-store.svg" alt="App Store" width={120} height={40} className="h-8 w-auto" />
          <span className="text-xs text-gray-500" style={{ fontFamily: "var(--font-jakarta)" }}>
            Em breve para iOS
          </span>
        </div>
      </div>

      {/* Instagram */}
      <Link
        href="https://www.instagram.com/zupet.io/"
        target="_blank"
        rel="noopener noreferrer"
        className="mt-8 flex items-center gap-2 px-5 py-3 rounded-2xl border border-white/10 bg-white/5 hover:bg-white/10 hover:border-white/20 transition-all duration-200"
        style={{ fontFamily: "var(--font-jakarta)" }}
      >
        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="url(#ig-gradient)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <defs>
            <linearGradient id="ig-gradient" x1="0%" y1="100%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="#f09433"/>
              <stop offset="25%" stopColor="#e6683c"/>
              <stop offset="50%" stopColor="#dc2743"/>
              <stop offset="75%" stopColor="#cc2366"/>
              <stop offset="100%" stopColor="#bc1888"/>
            </linearGradient>
          </defs>
          <rect x="2" y="2" width="20" height="20" rx="5" ry="5"/>
          <circle cx="12" cy="12" r="4"/>
          <circle cx="17.5" cy="6.5" r="0.5" fill="url(#ig-gradient)" stroke="none"/>
        </svg>
        <span className="text-sm text-gray-300">@zupet.io</span>
      </Link>

      {/* Botão voltar */}
      <Link
        href="https://zupet.io"
        className="mt-10 flex items-center gap-2 text-sm text-gray-500 hover:text-gray-300 transition-colors"
        style={{ fontFamily: "var(--font-jakarta)" }}
      >
        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M19 12H5M12 5l-7 7 7 7"/>
        </svg>
        Voltar para o site
      </Link>

      {/* Rodapé */}
      <p className="mt-6 text-xs text-gray-600 text-center" style={{ fontFamily: "var(--font-jakarta)" }}>
        Grátis · Sem anúncios invasivos · zupet.io
      </p>
    </main>
  );
}
