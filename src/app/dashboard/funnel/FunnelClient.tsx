"use client";

import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ArrowDown, TrendingDown } from "lucide-react";

type FunnelData = {
  total: number;
  steps: { label: string; count: number; pct: number }[];
  dropoffs: { label: string; lost: number; pct: number }[];
};

const STEP_COLORS = [
  "bg-primary",
  "bg-violet-500",
  "bg-blue-500",
  "bg-emerald-500",
  "bg-amber-500",
  "bg-rose-500",
];

export default function FunnelClient({ data }: { data: FunnelData }) {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-heading text-3xl font-bold">Funil de Conversão</h1>
        <p className="text-muted-foreground text-sm mt-1">Jornada do usuário desde o cadastro até o uso completo do app</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Funil visual */}
        <Card>
          <CardHeader>
            <CardTitle>Funil de Uso</CardTitle>
            <CardDescription>Quantos usuários completaram cada etapa</CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            {data.steps.map((step, i) => (
              <div key={step.label}>
                <div className="flex justify-between text-sm mb-1.5">
                  <span className="font-medium">{step.label}</span>
                  <span className="text-muted-foreground font-mono">{step.count} ({step.pct}%)</span>
                </div>
                <div className="h-8 w-full rounded-lg bg-muted overflow-hidden">
                  <div
                    className={`h-full rounded-lg ${STEP_COLORS[i]} flex items-center justify-end pr-3 transition-all`}
                    style={{ width: `${Math.max(step.pct, 2)}%` }}
                  >
                    {step.pct >= 15 && (
                      <span className="text-white text-xs font-bold">{step.pct}%</span>
                    )}
                  </div>
                </div>
                {i < data.steps.length - 1 && (
                  <div className="flex justify-center my-1">
                    <ArrowDown className="h-4 w-4 text-muted-foreground" />
                  </div>
                )}
              </div>
            ))}
          </CardContent>
        </Card>

        {/* Drop-offs */}
        <Card>
          <CardHeader>
            <CardTitle>Abandono por Etapa</CardTitle>
            <CardDescription>Onde os usuários param de usar o app</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {data.dropoffs.map((d, i) => (
              <div key={i} className="flex items-start gap-3 p-3 rounded-lg bg-muted/50">
                <div className="w-8 h-8 rounded-lg bg-red-500/10 flex items-center justify-center flex-shrink-0">
                  <TrendingDown className="h-4 w-4 text-red-500" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-xs text-muted-foreground leading-tight">{d.label}</p>
                  <div className="flex items-center gap-2 mt-1">
                    <span className="text-sm font-bold">{d.lost} usuários</span>
                    <Badge
                      variant="outline"
                      className={`text-xs ${d.pct > 50 ? "border-red-400 text-red-600" : d.pct > 25 ? "border-amber-400 text-amber-600" : "border-emerald-400 text-emerald-600"}`}
                    >
                      -{d.pct}% drop-off
                    </Badge>
                  </div>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>
      </div>

      {/* Tabela resumo */}
      <Card>
        <CardHeader>
          <CardTitle>Resumo do Funil</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-3 md:grid-cols-6 gap-4">
            {data.steps.map((step, i) => (
              <div key={i} className="text-center">
                <div className={`w-12 h-12 rounded-full ${STEP_COLORS[i]} mx-auto flex items-center justify-center mb-2`}>
                  <span className="text-white text-sm font-bold">{i + 1}</span>
                </div>
                <p className="text-xl font-bold font-heading">{step.pct}%</p>
                <p className="text-xs text-muted-foreground leading-tight mt-0.5">{step.label}</p>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
