import type { NextConfig } from "next";
import createNextIntlPlugin from "next-intl/plugin";

const nextConfig: NextConfig = {
  images: {
    formats: ["image/avif", "image/webp"],
  },
  // O build no Vercel roda com 1 worker (build machine de 2 cores) e
  // intermitentemente falha em gerar middleware.js.nft.json (ENOENT) —
  // forçar 1 worker explicitamente elimina qualquer condição de corrida
  // entre o tracing do middleware e a finalização do output.
  experimental: {
    cpus: 1,
  },
};

const withNextIntl = createNextIntlPlugin("./src/i18n/request.ts");

export default withNextIntl(nextConfig);
