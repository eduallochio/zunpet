"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";

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

      {/* Botões */}
      <div className="flex flex-col gap-4 w-full max-w-xs">
        {/* Google Play */}
        <Link
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
        </Link>

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

      {/* Rodapé */}
      <p className="mt-12 text-xs text-gray-600 text-center" style={{ fontFamily: "var(--font-jakarta)" }}>
        Grátis · Sem anúncios invasivos ·{" "}
        <Link href="https://zupet.io" className="underline hover:text-gray-400 transition-colors">
          zupet.io
        </Link>
      </p>
    </main>
  );
}
