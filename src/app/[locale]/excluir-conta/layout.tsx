import { getPathname } from "@/i18n/navigation";
import { routing } from "@/i18n/routing";

const host = "https://zupet.io";

export async function generateMetadata() {
  const languages: Record<string, string> = {};
  for (const locale of routing.locales) {
    languages[locale] = host + (await getPathname({ locale, href: "/excluir-conta" }));
  }

  return {
    title: "Excluir Conta — Zupet",
    description: "Solicite a exclusão da sua conta e dados do aplicativo Zupet.",
    alternates: { canonical: host + "/excluir-conta", languages },
    robots: { index: true, follow: true },
  };
}

export default function ExcluirContaLayout({ children }: { children: React.ReactNode }) {
  return children;
}
