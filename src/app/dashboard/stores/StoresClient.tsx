"use client";

import Image from "next/image";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
  ChartLegend,
  ChartLegendContent,
} from "@/components/ui/chart";
import {
  BarChart, Bar, CartesianGrid, XAxis, YAxis,
} from "recharts";
import { Star, AlertCircle, CheckCircle2, Smartphone } from "lucide-react";
import type { GooglePlayStatus } from "@/lib/stores/google-play";
import type { AppStoreStatus } from "@/lib/stores/app-store";

type Props = {
  googlePlay: GooglePlayStatus;
  appStore: AppStoreStatus;
  googlePlayConfigured: boolean;
  appStoreConfigured: boolean;
};

const SETUP_STEPS = {
  googlePlay: [
    "Acesse Google Cloud Console → IAM → Service Accounts",
    "Crie uma Service Account com permissão \"View app information (read-only)\"",
    "Vincule ao Google Play Console em Configurações → Acesso à API",
    "Gere uma chave JSON e extraia client_email e private_key",
    "Adicione ao .env.local: GOOGLE_PLAY_PACKAGE_NAME, GOOGLE_PLAY_CLIENT_EMAIL, GOOGLE_PLAY_PRIVATE_KEY",
  ],
  appStore: [
    "Acesse App Store Connect → Usuários e Acesso → Chaves de API",
    "Gere uma nova chave com função \"Leitor\"",
    "Baixe o arquivo .p8 (disponível apenas uma vez)",
    "Anote o Key ID e o Issuer ID",
    "Adicione ao .env.local: APP_STORE_KEY_ID, APP_STORE_ISSUER_ID, APP_STORE_PRIVATE_KEY, APP_STORE_APP_ID",
  ],
};

function SetupCard({
  title,
  badge,
  badgeWidth,
  badgeHeight,
  iconColor,
  steps,
  envVars,
}: {
  title: string;
  badge: string;
  badgeWidth: number;
  badgeHeight: number;
  iconColor: string;
  steps: string[];
  envVars: string[];
}) {
  return (
    <Card className="border-dashed">
      <CardHeader>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Image src={badge} width={badgeWidth} height={badgeHeight} alt={title} className="h-8 w-auto object-contain" unoptimized />
            <div>
              <CardTitle className="text-base">{title}</CardTitle>
              <CardDescription>Não conectado</CardDescription>
            </div>
          </div>
          <Badge variant="outline" className="text-xs border-amber-500/30 text-amber-600 bg-amber-500/5">
            Aguardando configuração
          </Badge>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <p className="text-xs font-medium text-muted-foreground uppercase tracking-wide">Como conectar</p>
          <ol className="space-y-1.5">
            {steps.map((step, i) => (
              <li key={i} className="flex items-start gap-2 text-sm text-muted-foreground">
                <span className={`text-xs font-mono font-bold mt-0.5 ${iconColor} flex-shrink-0`}>{i + 1}.</span>
                {step}
              </li>
            ))}
          </ol>
        </div>
        <div className="bg-secondary/50 rounded-lg p-3 space-y-1">
          <p className="text-xs font-medium text-muted-foreground">Variáveis necessárias no <code className="text-xs bg-muted px-1 py-0.5 rounded">.env.local</code></p>
          {envVars.map((v) => (
            <p key={v} className="text-xs font-mono text-foreground">{v}=</p>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}

function StoreStatsCard({
  title,
  badge,
  badgeWidth,
  badgeHeight,
  data,
  chartColor,
  chartKey,
}: {
  title: string;
  badge: string;
  badgeWidth: number;
  badgeHeight: number;
  data: { totalInstalls: number; activeInstalls: number; rating: number; ratingCount: number; monthlyData: { month: string; installs: number }[] };
  chartColor: string;
  chartKey: string;
}) {
  const chartConfig: ChartConfig = {
    [chartKey]: { label: "Downloads", color: chartColor },
  };
  const chartData = data.monthlyData.map((d) => ({ month: d.month, [chartKey]: d.installs }));

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Image src={badge} width={badgeWidth} height={badgeHeight} alt={title} className="h-8 w-auto object-contain" unoptimized />
            <div>
              <CardTitle className="text-base">{title}</CardTitle>
              <CardDescription>Dados dos últimos 12 meses</CardDescription>
            </div>
          </div>
          <Badge variant="outline" className="text-xs border-emerald-500/30 text-emerald-600 bg-emerald-500/5">
            <CheckCircle2 className="h-3 w-3 mr-1" />
            Conectado
          </Badge>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* KPIs */}
        <div className="grid grid-cols-2 gap-3">
          <div className="bg-secondary/50 rounded-lg p-3">
            <p className="text-xl font-heading font-bold">{data.totalInstalls.toLocaleString("pt-BR")}</p>
            <p className="text-xs text-muted-foreground">Downloads totais (12m)</p>
          </div>
          {data.activeInstalls > 0 ? (
            <div className="bg-secondary/50 rounded-lg p-3">
              <p className="text-xl font-heading font-bold">{data.activeInstalls.toLocaleString("pt-BR")}</p>
              <p className="text-xs text-muted-foreground">Instalações ativas</p>
            </div>
          ) : data.rating > 0 ? (
            <div className="bg-secondary/50 rounded-lg p-3">
              <div className="flex items-center gap-1">
                <p className="text-xl font-heading font-bold">{data.rating.toFixed(1)}</p>
                <Star className="h-4 w-4 text-amber-500 fill-amber-500" />
              </div>
              <p className="text-xs text-muted-foreground">{data.ratingCount.toLocaleString("pt-BR")} avaliações</p>
            </div>
          ) : (
            <div className="bg-secondary/50 rounded-lg p-3">
              <p className="text-xl font-heading font-bold">—</p>
              <p className="text-xs text-muted-foreground">Instalações ativas</p>
            </div>
          )}
        </div>

        {/* Gráfico mensal */}
        <ChartContainer config={chartConfig} className="h-40 w-full">
          <BarChart data={chartData} margin={{ left: 0, right: 0, top: 4, bottom: 0 }}>
            <CartesianGrid vertical={false} stroke="hsl(var(--border))" />
            <XAxis dataKey="month" tickLine={false} axisLine={false} tick={{ fontSize: 10, fill: "hsl(var(--muted-foreground))" }} />
            <YAxis tickLine={false} axisLine={false} tick={{ fontSize: 10, fill: "hsl(var(--muted-foreground))" }} width={28} allowDecimals={false} />
            <ChartTooltip content={<ChartTooltipContent />} />
            <Bar dataKey={chartKey} fill={chartColor} radius={[3, 3, 0, 0]} />
          </BarChart>
        </ChartContainer>
      </CardContent>
    </Card>
  );
}

export default function StoresClient({ googlePlay, appStore, googlePlayConfigured, appStoreConfigured }: Props) {
  const bothConnected = googlePlay.connected && appStore.connected;
  const anyConnected = googlePlay.connected || appStore.connected;

  const totalDownloads =
    (googlePlay.connected ? googlePlay.data.totalInstalls : 0) +
    (appStore.connected ? appStore.data.totalInstalls : 0);

  // Combinar dados mensais se ambos conectados
  const combinedMonthly = bothConnected
    ? googlePlay.data.monthlyData.map((g, i) => ({
        month: g.month,
        Android: g.installs,
        iOS: appStore.connected ? appStore.data.monthlyData[i]?.installs ?? 0 : 0,
      }))
    : null;

  const combinedConfig: ChartConfig = {
    Android: { label: "Android", color: "hsl(142 60% 45%)" },
    iOS: { label: "iOS", color: "hsl(210 80% 55%)" },
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-heading text-3xl font-bold">Lojas</h1>
        <p className="text-muted-foreground text-sm mt-1">Downloads e métricas do Google Play e App Store</p>
      </div>

      {/* Status geral */}
      <div className="flex items-center gap-3 p-4 rounded-xl border bg-card">
        <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${anyConnected ? "bg-emerald-500/10" : "bg-amber-500/10"}`}>
          {anyConnected ? (
            <CheckCircle2 className="h-5 w-5 text-emerald-600" />
          ) : (
            <AlertCircle className="h-5 w-5 text-amber-600" />
          )}
        </div>
        <div className="flex-1">
          <p className="text-sm font-medium">
            {bothConnected
              ? "Ambas as lojas conectadas"
              : anyConnected
              ? "Uma loja conectada"
              : "Nenhuma loja conectada — configure as variáveis de ambiente para ativar"}
          </p>
          <p className="text-xs text-muted-foreground">
            Google Play: {googlePlayConfigured ? "configurado" : "não configurado"} ·
            App Store: {appStoreConfigured ? "configurado" : "não configurado"}
          </p>
        </div>
        {anyConnected && (
          <div className="text-right">
            <p className="text-2xl font-heading font-bold">{totalDownloads.toLocaleString("pt-BR")}</p>
            <p className="text-xs text-muted-foreground">downloads combinados</p>
          </div>
        )}
      </div>

      {/* Gráfico combinado se ambos conectados */}
      {combinedMonthly && (
        <Card>
          <CardHeader>
            <CardTitle>Downloads por Mês — Combinado</CardTitle>
            <CardDescription>Android + iOS nos últimos 12 meses</CardDescription>
          </CardHeader>
          <CardContent>
            <ChartContainer config={combinedConfig} className="h-56 w-full">
              <BarChart data={combinedMonthly} margin={{ left: 0, right: 0, top: 4, bottom: 0 }}>
                <CartesianGrid vertical={false} stroke="hsl(var(--border))" />
                <XAxis dataKey="month" tickLine={false} axisLine={false} tick={{ fontSize: 11, fill: "hsl(var(--muted-foreground))" }} />
                <YAxis tickLine={false} axisLine={false} tick={{ fontSize: 11, fill: "hsl(var(--muted-foreground))" }} width={28} allowDecimals={false} />
                <ChartTooltip content={<ChartTooltipContent />} />
                <ChartLegend content={<ChartLegendContent />} />
                <Bar dataKey="Android" fill="hsl(142 60% 45%)" radius={[3, 3, 0, 0]} stackId="a" />
                <Bar dataKey="iOS" fill="hsl(210 80% 55%)" radius={[3, 3, 0, 0]} stackId="a" />
              </BarChart>
            </ChartContainer>
          </CardContent>
        </Card>
      )}

      {/* Cards individuais */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {googlePlay.connected ? (
          <StoreStatsCard
            title="Google Play"
            badge="/stores/google-play.png"
            badgeWidth={135}
            badgeHeight={40}
            data={googlePlay.data}
            chartColor="hsl(142 60% 45%)"
            chartKey="Android"
          />
        ) : (
          <SetupCard
            title="Google Play"
            badge="/stores/google-play.png"
            badgeWidth={135}
            badgeHeight={40}
            iconColor="text-emerald-600"
            steps={SETUP_STEPS.googlePlay}
            envVars={["GOOGLE_PLAY_PACKAGE_NAME", "GOOGLE_PLAY_CLIENT_EMAIL", "GOOGLE_PLAY_PRIVATE_KEY"]}
          />
        )}

        {appStore.connected ? (
          <StoreStatsCard
            title="App Store"
            badge="/stores/app-store.svg"
            badgeWidth={120}
            badgeHeight={40}
            data={appStore.data}
            chartColor="hsl(210 80% 55%)"
            chartKey="iOS"
          />
        ) : (
          <SetupCard
            title="App Store"
            badge="/stores/app-store.svg"
            badgeWidth={120}
            badgeHeight={40}
            iconColor="text-blue-600"
            steps={SETUP_STEPS.appStore}
            envVars={["APP_STORE_KEY_ID", "APP_STORE_ISSUER_ID", "APP_STORE_PRIVATE_KEY", "APP_STORE_APP_ID"]}
          />
        )}
      </div>

      {/* Info sobre limitações */}
      <Card className="bg-secondary/30 border-0">
        <CardContent className="pt-6">
          <div className="flex items-start gap-3">
            <Smartphone className="h-4 w-4 text-muted-foreground mt-0.5 flex-shrink-0" />
            <div className="space-y-1 text-xs text-muted-foreground">
              <p className="font-medium text-foreground text-sm">Limitações das APIs das lojas</p>
              <p>• <strong>Downloads totais históricos</strong> não estão disponíveis nas APIs — apenas dados a partir da data de conexão</p>
              <p>• <strong>Google Play</strong>: instalações ativas e desinstalações requerem nível de acesso avançado no Play Console</p>
              <p>• <strong>App Store</strong>: instalações ativas não são expostas pela API — apenas downloads e atualizações</p>
              <p>• Os dados das lojas têm delay de 2–3 dias em relação ao tempo real</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
