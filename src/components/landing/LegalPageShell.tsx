import Image from "next/image";
import { getTranslations, getLocale } from "next-intl/server";
import { Link } from "@/i18n/navigation";

type Props = {
  otherLegalHref: "/privacidade" | "/termos";
  otherLegalLabelKey: "navPrivacy" | "navTerms";
  children: React.ReactNode;
};

// Envolve as páginas legais (Privacidade/Termos) com navegação traduzida.
// O conteúdo jurídico em si (passado via children) permanece sempre em
// português, já que é regido pela legislação brasileira (LGPD).
export async function LegalPageShell({ otherLegalHref, otherLegalLabelKey, children }: Props) {
  const t = await getTranslations("Legal");
  const locale = await getLocale();

  return (
    <div style={{ background: "oklch(0.10 0 0)", color: "oklch(0.92 0 0)", minHeight: "100vh" }}>
      <header className="border-b" style={{ borderColor: "oklch(0.18 0 0)", background: "oklch(0.10 0 0 / 0.95)", backdropFilter: "blur(20px)" }}>
        <div className="max-w-3xl mx-auto px-6 h-14 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2.5">
            <Image src="/icon.png" alt="Zupet" width={28} height={28} className="rounded-lg" />
            <span className="font-bold text-base" style={{ color: "oklch(0.97 0 0)" }}>Zupet</span>
          </Link>
          <Link href={otherLegalHref} className="text-sm transition-colors" style={{ color: "oklch(0.65 0 0)" }}>
            {t(otherLegalLabelKey)}
          </Link>
        </div>
      </header>

      {locale !== "pt-BR" && (
        <div className="max-w-3xl mx-auto px-6 pt-8">
          <div className="p-4 rounded-xl text-sm" style={{ background: "oklch(0.62 0.18 60 / 0.10)", border: "1px solid oklch(0.62 0.18 60 / 0.25)" }}>
            <p className="font-medium mb-1" style={{ color: "oklch(0.80 0.10 60)" }}>{t("noticeTitle")}</p>
            <p style={{ color: "oklch(0.68 0 0)" }}>{t("noticeDesc")}</p>
          </div>
        </div>
      )}

      <main className="max-w-3xl mx-auto px-6 py-14">
        {children}
      </main>

      <footer className="border-t mt-10" style={{ borderColor: "oklch(0.15 0 0)" }}>
        <div className="max-w-3xl mx-auto px-6 py-8 flex flex-col md:flex-row items-center justify-between gap-4 text-xs" style={{ color: "oklch(0.50 0 0)" }}>
          <p>© {new Date().getFullYear()} Zupet.</p>
          <div className="flex gap-6">
            <Link href="/" className="hover:text-white transition-colors">{t("navHome")}</Link>
            <Link href={otherLegalHref} className="hover:text-white transition-colors">{t(otherLegalLabelKey)}</Link>
            <Link href="/excluir-conta" className="hover:text-white transition-colors">{t("navDeleteAccount")}</Link>
          </div>
        </div>
      </footer>
    </div>
  );
}
