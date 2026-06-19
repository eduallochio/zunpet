"use client";

import { useEffect } from "react";

// O <html lang> raiz fica fixo em "pt-BR" porque é compartilhado com o
// painel admin (fora do i18n). Para páginas públicas com outro locale,
// sincroniza o atributo no client — importante para leitores de tela e SEO.
export function HtmlLangSync({ locale }: { locale: string }) {
  useEffect(() => {
    document.documentElement.lang = locale;
    return () => {
      document.documentElement.lang = "pt-BR";
    };
  }, [locale]);

  return null;
}
