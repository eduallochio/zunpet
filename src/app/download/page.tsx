"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";
import { TrackPageView, TrackableStoreLink } from "@/components/landing/TrackingProvider";

const GOOGLE_PLAY_URL = "https://play.google.com/store/apps/details?id=io.zupet.app&hl=pt_BR";
const APP_STORE_URL = "https://apps.apple.com/app/zupet/id0000000000"; // placeholder até publicar

type Platform = "android" | "ios" | "unknown";

function detectPlatform(): Platform {
  if (typeof navigator === "undefined") return "unknown";
  const ua = navigator.userAgent.toLowerCase();
  if (/android/.test(ua)) return "android";
  if (/iphone|ipad|ipod/.test(ua)) return "ios";
  return "unknown";
}

export default function DownloadPage() {
  const [platform, setPlatform] = useState<Platform>("unknown");
  const [redirecting, setRedirecting] = useState(false);

  useEffect(() => {
    const p = detectPlatform();
    setPlatform(p);

    if (p === "android") {
      setRedirecting(true);
      const timer = setTimeout(() => {
        window.location.href = GOOGLE_PLAY_URL;
      }, 1500);
      return () => clearTimeout(timer);
    }

    if (p === "ios") {
      setRedirecting(true);
      const timer = setTimeout(() => {
        window.location.href = APP_STORE_URL;
      }, 1500);
      return () => clearTimeout(timer);
    }
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

      {/* Redirect status */}
      {redirecting && (
        <div className="mb-8 flex items-center gap-2 text-teal-400 text-sm" style={{ fontFamily: "var(--font-jakarta)" }}>
          <span className="inline-block w-2 h-2 rounded-full bg-teal-400 animate-pulse" />
          {platform === "android" ? "Redirecionando para o Google Play…" : "Redirecionando para a App Store…"}
        </div>
      )}

      {/* Screenshots */}
      <div className="flex gap-3 mb-8 overflow-x-auto pb-2 max-w-xs w-full scrollbar-hide">
        {["perfil-pet.png", "agenda.png", "conquistas.png"].map((src) => (
          <Image
            key={src}
            src={`/screenshots/${src}`}
            alt="Zupet app"
            width={100}
            height={216}
            className="rounded-2xl shadow-lg flex-shrink-0 border border-white/10"
            style={{ height: 216, width: "auto" }}
          />
        ))}
      </div>

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
