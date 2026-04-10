# Zupet Dashboard

Painel administrativo e landing page do **Zupet** — o app para cuidar do seu pet com inteligência.

## Sobre

O Zupet Dashboard é uma aplicação Next.js que serve dois propósitos:

- **Landing Page** (`/`) — página pública de apresentação do app Zupet com rastreamento de visitas e cliques nas lojas
- **Painel Admin** (`/dashboard`) — área restrita para visualização de métricas, usuários, pets e analytics da landing page

## Stack

- [Next.js 16](https://nextjs.org/) — App Router, Server Components, Edge Runtime
- [Supabase](https://supabase.com/) — banco de dados PostgreSQL, autenticação e RLS
- [Tailwind CSS](https://tailwindcss.com/) — estilização
- [shadcn/ui](https://ui.shadcn.com/) — componentes de UI
- [Recharts](https://recharts.org/) — gráficos do dashboard
- [Lucide React](https://lucide.dev/) — ícones

## Funcionalidades

### Landing Page
- Design responsivo com animações (FadeUp, ScaleIn, StaggerChildren)
- Rastreamento de visitas (`page_views`) e cliques nas lojas (`store_clicks`)
- Filtragem de bots via `navigator.webdriver`
- OG Image gerado dinamicamente via `ImageResponse`
- SEO completo com JSON-LD (MobileApplication + FAQPage)
- Links para Google Play e App Store

### Dashboard Admin
- Visão geral com métricas de usuários, pets, fotos, lembretes e diário
- Listagem e busca de usuários e pets
- Analytics da landing page com gráficos de área, barras e pizza
- Filtros de data por preset (7d / 30d / 90d / tudo) ou intervalo customizado
- Autenticação protegida por JWT

## Variáveis de Ambiente

Crie um arquivo `.env.local` na raiz com:

```env
NEXT_PUBLIC_SUPABASE_URL=sua_url_supabase
NEXT_PUBLIC_SUPABASE_ANON_KEY=sua_anon_key
SUPABASE_SERVICE_ROLE_KEY=sua_service_role_key
ADMIN_EMAIL=seu_email_admin
ADMIN_PASSWORD=sua_senha_admin
JWT_SECRET=seu_jwt_secret
```

## Instalação

```bash
npm install
npm run dev
```

Acesse [http://localhost:3000](http://localhost:3000).

## Deploy

Este projeto é hospedado na [Vercel](https://vercel.com). Para fazer deploy:

```bash
npm i -g vercel
vercel login
vercel link
vercel --prod
```

Adicione as variáveis de ambiente em **Settings → Environment Variables** no painel da Vercel.

## Banco de Dados

As migrations estão na pasta `banco/`. Execute-as no SQL Editor do Supabase na seguinte ordem:

1. `schema.sql` — estrutura principal
2. `migration_v2.sql` — atualizações de schema
3. `migration_v4_analytics.sql` — tabelas de analytics (`page_views`, `store_clicks`)

## Links

- App Android: [Google Play](https://play.google.com/store/apps/details?id=com.zupet.app)
- Instagram: [@zupet.io](https://www.instagram.com/zupet.io/)
- Site: [zupet.io](https://zupet.io)
- Desenvolvido por: [omegasistem.com.br](https://omegasistem.com.br)
