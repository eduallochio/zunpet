import createMiddleware from "next-intl/middleware";
import { routing } from "./src/i18n/routing";

export default createMiddleware(routing);

export const config = {
  // Aplica o middleware só nas rotas públicas com i18n — o painel admin
  // (/dashboard, /login, /pets, /users, /download) fica fora, sem prefixo
  // de idioma e sem passar pela detecção de locale.
  matcher: ["/", "/(pt-BR|en|es)/:path*", "/privacidade", "/termos", "/excluir-conta"],
};
