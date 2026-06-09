import type { Metadata } from "next";
import { Bricolage_Grotesque, Plus_Jakarta_Sans } from "next/font/google";
import "./globals.css";

const bricolage = Bricolage_Grotesque({
  variable: "--font-bricolage",
  subsets: ["latin"],
  weight: ["600", "700", "800"],
});

const jakarta = Plus_Jakarta_Sans({
  variable: "--font-jakarta",
  subsets: ["latin"],
  weight: ["400", "500"],
});

export const metadata: Metadata = {
  metadataBase: new URL("https://zupet.io"),
  title: {
    default: "Zupet — O app completo para cuidar do seu pet",
    template: "%s | Zupet",
  },
  description: "Vacinas, consultas, lembretes, peso e fotos do seu pet num só lugar. Baixe grátis no Google Play.",
  keywords: ["app para pets", "cuidar de pet", "vacinas pet", "lembretes pet", "saúde animal", "zupet"],
  authors: [{ name: "Zupet" }],
  creator: "Zupet",
  robots: {
    index: true,
    follow: true,
    googleBot: { index: true, follow: true, "max-snippet": 160, "max-image-preview": "large" },
  },
  openGraph: {
    type: "website",
    locale: "pt_BR",
    url: "https://zupet.io",
    siteName: "Zupet",
    title: "Zupet — O app completo para cuidar do seu pet",
    description: "Vacinas, consultas, lembretes, peso e fotos do seu pet num só lugar. Baixe grátis no Google Play.",
    images: [{ url: "/icon.png", width: 512, height: 512, alt: "Zupet — app para cuidar do seu pet" }],
  },
  twitter: {
    card: "summary",
    title: "Zupet — O app completo para cuidar do seu pet",
    description: "Vacinas, consultas, lembretes, peso e fotos do seu pet num só lugar. Baixe grátis no Google Play.",
    images: ["/icon.png"],
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="pt-BR"
      className={`${bricolage.variable} ${jakarta.variable} h-full antialiased`}
    >
      <head>
        <link rel="preconnect" href="https://hhgggnlnbhxvzfcmkmds.supabase.co" />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "MobileApplication",
            "name": "Zupet",
            "description": "Vacinas, consultas, lembretes, peso e fotos do seu pet num só lugar.",
            "url": "https://zupet.io",
            "applicationCategory": "LifestyleApplication",
            "operatingSystem": "Android",
            "offers": { "@type": "Offer", "price": "0", "priceCurrency": "BRL" },
            "aggregateRating": { "@type": "AggregateRating", "ratingValue": "5", "ratingCount": "1" },
            "downloadUrl": "https://play.google.com/store/apps/details?id=io.zupet.app",
            "publisher": { "@type": "Organization", "name": "Zupet", "url": "https://zupet.io" },
          })}}
        />
      </head>
      <body className="min-h-full flex flex-col bg-background text-foreground">
        {children}
      </body>
    </html>
  );
}
