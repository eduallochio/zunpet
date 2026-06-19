import { MetadataRoute } from "next";
import { getPathname } from "@/i18n/navigation";
import { routing } from "@/i18n/routing";

const host = "https://zupet.io";

async function localizedAlternates(href: string) {
  const languages: Record<string, string> = {};
  for (const locale of routing.locales) {
    languages[locale] = host + (await getPathname({ locale, href }));
  }
  return languages;
}

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  return [
    {
      url: host,
      lastModified: new Date(),
      changeFrequency: "weekly",
      priority: 1.0,
      alternates: { languages: await localizedAlternates("/") },
    },
    {
      url: host + "/download",
      lastModified: new Date(),
      changeFrequency: "monthly",
      priority: 0.9,
    },
    {
      url: host + "/privacidade",
      lastModified: new Date(),
      changeFrequency: "yearly",
      priority: 0.3,
      alternates: { languages: await localizedAlternates("/privacidade") },
    },
    {
      url: host + "/termos",
      lastModified: new Date(),
      changeFrequency: "yearly",
      priority: 0.3,
      alternates: { languages: await localizedAlternates("/termos") },
    },
    {
      url: host + "/excluir-conta",
      lastModified: new Date(),
      changeFrequency: "yearly",
      priority: 0.3,
      alternates: { languages: await localizedAlternates("/excluir-conta") },
    },
  ];
}
