"use client";

import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, ReferenceLine } from "recharts";
import { AlertTriangle, Info, CheckCircle, UserMinus, UserPlus, Smartphone } from "lucide-react";

type Alert = { type: "danger" | "warning" | "info"; title: string; description: string };

type AlertsData = {
  alerts: Alert[];
  inactive30: number;
  inactive90: number;
  newLast2Days: number;
  newLast7Days: number;
  avgDaily: number;
  peakDay: { date: string; count: number } | null;
  outdated: number;
  latestVersion: string | null;
  dailyChart: { date: string; cadastros: number }[];
  total: number;
};

function AlertCard({ alert }: { alert: Alert }) {
  const config = {
    danger:  { icon: AlertTriangle, bg: "bg-red-50 border-red-200",    iconColor: "text-red-500",   badgeClass: "bg-red-100 text-red-700" },
    warning: { icon: AlertTriangle, bg: "bg-amber-50 border-amber-200", iconColor: "text-amber-500", badgeClass: "bg-amber-100 text-amber-700" },
    info:    { icon: Info,          bg: "bg-blue-50 border-blue-200",   iconColor: "text-blue-500",  badgeClass: "bg-blue-100 text-blue-700" },
  }[alert.type];
  const Icon = config.icon;

  return (
    <div className={`flex items-start gap-3 p-4 rounded-xl border ${config.bg}`}>
      <Icon className={`h-5 w-5 mt-0.5 flex-shrink-0 ${config.iconColor}`} />
      <div className="flex-1">
        <div className="flex items-center gap-2 mb-1">
          <p className="text-sm font-semibold">{alert.title}</p>
          <Badge className={`text-xs ${config.badgeClass} border-0`}>
            {alert.type === "danger" ? "Crítico" : alert.type === "warning" ? "Atenção" : "Info"}
          </Badge>
        </div>
        <p className="text-sm text-muted-foreground">{alert.description}</p>
      </div>
    </div>
  );
}

export default function AlertsClient({ data }: { data: AlertsData }) {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-heading text-3xl font-bold">Alertas Operacionais</h1>
        <p className="text-muted-foreground text-sm mt-1">Monitoramento em tempo real da plataforma</p>
      </div>

      {/* Alertas */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            Alertas Ativos
            <Badge variant="outline">{data.alerts.length}</Badge>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          {data.alerts.map((a, i) => <AlertCard key={i} alert={a} />)}
        </CardContent>
      </Card>

      {/* KPIs operacionais */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-lg bg-emerald-500/10 flex items-center justify-center">
                <UserPlus className="h-5 w-5 text-emerald-600" />
              </div>
              <div>
                <p className="text-2xl font-bold font-heading">{data.newLast2Days}</p>
                <p className="text-xs text-muted-foreground">Novos em 48h</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-lg bg-blue-500/10 flex items-center justify-center">
                <UserPlus className="h-5 w-5 text-blue-600" />
              </div>
              <div>
                <p className="text-2xl font-bold font-heading">{data.newLast7Days}</p>
                <p className="text-xs text-muted-foreground">Novos em 7 dias</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-lg bg-amber-500/10 flex items-center justify-center">
                <UserMinus className="h-5 w-5 text-amber-600" />
              </div>
              <div>
                <p className="text-2xl font-bold font-heading">{data.inactive30}</p>
                <p className="text-xs text-muted-foreground">Inativos 30d</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-lg bg-red-500/10 flex items-center justify-center">
                <Smartphone className="h-5 w-5 text-red-500" />
              </div>
              <div>
                <p className="text-2xl font-bold font-heading">{data.outdated}</p>
                <p className="text-xs text-muted-foreground">Versão antiga</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Gráfico de cadastros diários */}
      <Card>
        <CardHeader>
          <CardTitle>Cadastros por Dia — Últimos 14 dias</CardTitle>
          <CardDescription>
            Média diária: {data.avgDaily} cadastros
            {data.peakDay && ` · Pico: ${data.peakDay.count} em ${data.peakDay.date}`}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={240}>
            <BarChart data={data.dailyChart} margin={{ left: -10, right: 10 }}>
              <CartesianGrid strokeDasharray="3 3" className="stroke-border" />
              <XAxis dataKey="date" tick={{ fontSize: 11 }} />
              <YAxis tick={{ fontSize: 12 }} allowDecimals={false} />
              <Tooltip contentStyle={{ fontSize: 12, borderRadius: 8 }} />
              <ReferenceLine y={data.avgDaily} stroke="hsl(38 90% 55%)" strokeDasharray="4 2" label={{ value: "média", fontSize: 11, fill: "hsl(38 90% 55%)" }} />
              <Bar dataKey="cadastros" name="Cadastros" fill="hsl(174 60% 40%)" radius={[4,4,0,0]} />
            </BarChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      {/* Inatividade */}
      <Card>
        <CardHeader>
          <CardTitle>Inatividade</CardTitle>
          <CardDescription>Usuários que não abrem o app há mais de X dias</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 gap-6">
            {[
              { label: "Inativos há +30 dias", count: data.inactive30, color: "bg-amber-500" },
              { label: "Inativos há +90 dias", count: data.inactive90, color: "bg-red-500" },
            ].map(({ label, count, color }) => {
              const pct = data.total > 0 ? Math.round((count / data.total) * 100) : 0;
              return (
                <div key={label} className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">{label}</span>
                    <span className="font-bold">{count} ({pct}%)</span>
                  </div>
                  <div className="h-3 w-full rounded-full bg-muted overflow-hidden">
                    <div className={`h-full rounded-full ${color}`} style={{ width: `${pct}%` }} />
                  </div>
                </div>
              );
            })}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
