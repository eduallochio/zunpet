"use client";

import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend,
  ResponsiveContainer,
} from "recharts";
import { Users, Activity, TrendingUp, UserX, ArrowUpRight, ArrowDownRight } from "lucide-react";

type RetentionData = {
  total: number;
  active7: number;
  active30: number;
  active90: number;
  newThisMonth: number;
  newLastMonth: number;
  growthRate: number;
  retention30Rate: number;
  neverActive: number;
  weeklyChart: { label: string; novos: number; ativos: number }[];
};

function KpiCard({ title, value, sub, icon: Icon, color, trend }: {
  title: string; value: string | number; sub: string;
  icon: React.ElementType; color: string; trend?: number;
}) {
  const up = (trend ?? 0) >= 0;
  return (
    <Card>
      <CardHeader className="pb-2 flex flex-row items-center justify-between space-y-0">
        <CardTitle className="text-sm font-medium text-muted-foreground">{title}</CardTitle>
        <div className={`w-9 h-9 rounded-lg flex items-center justify-center ${color}`}>
          <Icon className="h-5 w-5" />
        </div>
      </CardHeader>
      <CardContent>
        <p className="text-3xl font-heading font-bold">{value}</p>
        <div className="flex items-center gap-1.5 mt-1">
          {trend !== undefined && (
            <span className={`flex items-center text-xs font-medium ${up ? "text-emerald-600" : "text-red-500"}`}>
              {up ? <ArrowUpRight className="h-3 w-3" /> : <ArrowDownRight className="h-3 w-3" />}
              {Math.abs(trend)}%
            </span>
          )}
          <span className="text-xs text-muted-foreground">{sub}</span>
        </div>
      </CardContent>
    </Card>
  );
}

export default function RetentionClient({ data }: { data: RetentionData }) {
  const activeRate7  = data.total > 0 ? Math.round((data.active7  / data.total) * 100) : 0;
  const activeRate30 = data.total > 0 ? Math.round((data.active30 / data.total) * 100) : 0;
  const activeRate90 = data.total > 0 ? Math.round((data.active90 / data.total) * 100) : 0;

  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-heading text-3xl font-bold">Retenção & Engajamento</h1>
        <p className="text-muted-foreground text-sm mt-1">Atividade e engajamento dos usuários ao longo do tempo</p>
      </div>

      {/* KPIs */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <KpiCard
          title="Ativos últimos 7 dias"
          value={data.active7}
          sub={`${activeRate7}% da base`}
          icon={Activity}
          color="bg-emerald-500/10 text-emerald-600"
        />
        <KpiCard
          title="Ativos últimos 30 dias"
          value={data.active30}
          sub={`${activeRate30}% da base`}
          icon={Users}
          color="bg-primary/10 text-primary"
        />
        <KpiCard
          title="Novos este mês"
          value={data.newThisMonth}
          sub="vs mês anterior"
          icon={TrendingUp}
          color="bg-violet-500/10 text-violet-600"
          trend={data.growthRate}
        />
        <KpiCard
          title="Nunca ativos"
          value={data.neverActive}
          sub="sem perfil criado"
          icon={UserX}
          color="bg-red-500/10 text-red-500"
        />
      </div>

      {/* Gráfico semanal */}
      <Card>
        <CardHeader>
          <CardTitle>Novos vs Ativos por Semana</CardTitle>
          <CardDescription>Comparação entre cadastros novos e usuários que usaram o app</CardDescription>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={280}>
            <BarChart data={data.weeklyChart} margin={{ left: -10, right: 10, top: 4, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" className="stroke-border" />
              <XAxis dataKey="label" tick={{ fontSize: 12 }} />
              <YAxis tick={{ fontSize: 12 }} allowDecimals={false} />
              <Tooltip
                contentStyle={{ fontSize: 12, borderRadius: 8 }}
                labelFormatter={(l) => `Semana ${l}`}
              />
              <Legend />
              <Bar dataKey="novos"  name="Novos cadastros" fill="hsl(174 60% 40%)" radius={[4,4,0,0]} />
              <Bar dataKey="ativos" name="Usuários ativos"  fill="hsl(262 60% 58%)" radius={[4,4,0,0]} />
            </BarChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      {/* Taxas de atividade */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Card>
          <CardHeader>
            <CardTitle>Taxa de Atividade</CardTitle>
            <CardDescription>Percentual da base que usou o app em cada período</CardDescription>
          </CardHeader>
          <CardContent className="space-y-5">
            {[
              { label: "Últimos 7 dias", value: activeRate7, count: data.active7, color: "bg-emerald-500" },
              { label: "Últimos 30 dias", value: activeRate30, count: data.active30, color: "bg-primary" },
              { label: "Últimos 90 dias", value: activeRate90, count: data.active90, color: "bg-violet-500" },
            ].map(({ label, value, count, color }) => (
              <div key={label} className="space-y-1.5">
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">{label}</span>
                  <span className="font-medium">{count} usuários ({value}%)</span>
                </div>
                <div className="h-2 w-full rounded-full bg-muted overflow-hidden">
                  <div className={`h-full rounded-full ${color}`} style={{ width: `${value}%` }} />
                </div>
              </div>
            ))}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Retenção D30</CardTitle>
            <CardDescription>Usuários que cadastraram há 30-60 dias e ainda usam o app</CardDescription>
          </CardHeader>
          <CardContent className="flex flex-col items-center justify-center h-48 gap-4">
            <div className="relative w-36 h-36">
              <svg viewBox="0 0 36 36" className="w-full h-full -rotate-90">
                <circle cx="18" cy="18" r="15.9" fill="none" stroke="hsl(var(--muted))" strokeWidth="3" />
                <circle
                  cx="18" cy="18" r="15.9" fill="none"
                  stroke="hsl(174 60% 40%)" strokeWidth="3"
                  strokeDasharray={`${data.retention30Rate} ${100 - data.retention30Rate}`}
                  strokeLinecap="round"
                />
              </svg>
              <div className="absolute inset-0 flex flex-col items-center justify-center">
                <span className="text-3xl font-bold font-heading">{data.retention30Rate}%</span>
                <span className="text-xs text-muted-foreground">retenção</span>
              </div>
            </div>
            <Badge variant={data.retention30Rate >= 40 ? "default" : "destructive"} className="text-xs">
              {data.retention30Rate >= 60 ? "Excelente" : data.retention30Rate >= 40 ? "Bom" : data.retention30Rate >= 20 ? "Regular" : "Precisa melhorar"}
            </Badge>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
