"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";

const DEEP_LINK = "io.zupet.app://";
const GOOGLE_PLAY_URL = "https://play.google.com/store/apps/details?id=io.zupet.app&hl=pt_BR";

type Platform = "android" | "ios" | "desktop";

function detectPlatform(): Platform {
  if (typeof navigator === "undefined") return "desktop";
  const ua = navigator.userAgent.toLowerCase();
  if (/android/.test(ua)) return "android";
  if (/iphone|ipad|ipod/.test(ua)) return "ios";
  return "desktop";
}

export default function ConfirmarPage() {
  const [platform, setPlatform] = useState<Platform>("desktop");
  const [opened, setOpened] = useState(false);

  useEffect(() => {
    const p = detectPlatform();
    setPlatform(p);

    if (p === "android" || p === "ios") {
      // Tenta abrir o app via deep link após breve delay
      const timer = setTimeout(() => {
        window.location.href = DEEP_LINK;
        setOpened(true);
      }, 800);
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
      </div>

      {/* Card central */}
      <div className="w-full max-w-sm bg-white/5 border border-white/10 rounded-3xl p-8 flex flex-col items-center gap-6 text-center">
        {/* Ícone de sucesso */}
        <div className="w-16 h-16 rounded-full bg-teal-500/20 border border-teal-400/30 flex items-center justify-center">
          <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="#2dd4bf" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <path d="M20 6L9 17l-5-5" />
          </svg>
        </div>

        <div className="flex flex-col gap-2">
          <h2 className="text-xl font-bold text-white" style={{ fontFamily: "var(--font-bricolage)" }}>
            Email confirmado!
          </h2>
          <p className="text-sm text-gray-400 leading-relaxed" style={{ fontFamily: "var(--font-jakarta)" }}>
            {platform === "desktop"
              ? "Sua conta foi criada com sucesso. Abra o app Zupet no seu celular para começar a usar."
              : opened
                ? "Se o app não abriu automaticamente, toque no botão abaixo."
                : "Abrindo o Zupet…"}
          </p>
        </div>

        {/* Ação principal */}
        {platform === "desktop" ? (
          <a
            href={GOOGLE_PLAY_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="w-full flex items-center justify-center gap-3 rounded-2xl px-6 py-4 bg-teal-500 border border-teal-400 shadow-[0_0_24px_rgba(45,212,191,0.3)] hover:bg-teal-400 transition-all duration-200"
            style={{ fontFamily: "var(--font-jakarta)" }}
          >
            <Image src="/stores/google-play.png" alt="Google Play" width={100} height={30} className="h-7 w-auto" />
          </a>
        ) : (
          <a
            href={DEEP_LINK}
            className="w-full flex items-center justify-center gap-2 rounded-2xl px-6 py-4 bg-teal-500 border border-teal-400 shadow-[0_0_24px_rgba(45,212,191,0.3)] hover:bg-teal-400 transition-all duration-200 text-white font-semibold"
            style={{ fontFamily: "var(--font-jakarta)" }}
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M18 8h1a4 4 0 0 1 0 8h-1"/><path d="M2 8h16v9a4 4 0 0 1-4 4H6a4 4 0 0 1-4-4V8z"/><line x1="6" y1="1" x2="6" y2="4"/><line x1="10" y1="1" x2="10" y2="4"/><line x1="14" y1="1" x2="14" y2="4"/>
            </svg>
            Abrir o Zupet
          </a>
        )}

        {/* Fallback para mobile: link para a loja */}
        {platform !== "desktop" && (
          <a
            href={platform === "android" ? GOOGLE_PLAY_URL : "https://apps.apple.com/app/zupet/id0000000000"}
            target="_blank"
            rel="noopener noreferrer"
            className="text-xs text-gray-500 hover:text-gray-300 transition-colors underline underline-offset-2"
            style={{ fontFamily: "var(--font-jakarta)" }}
          >
            Não tem o app? Baixe agora
          </a>
        )}
      </div>

      {/* Voltar ao site */}
      <Link
        href="https://zupet.io"
        className="mt-10 flex items-center gap-2 text-sm text-gray-500 hover:text-gray-300 transition-colors"
        style={{ fontFamily: "var(--font-jakarta)" }}
      >
        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M19 12H5M12 5l-7 7 7 7" />
        </svg>
        Voltar para o site
      </Link>

      <p className="mt-6 text-xs text-gray-600 text-center" style={{ fontFamily: "var(--font-jakarta)" }}>
        Grátis · Sem anúncios invasivos · zupet.io
      </p>
    </main>
  );
}
