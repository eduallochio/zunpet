"use client";

import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";
import { UserX, PawPrint, MapPin, Smartphone, AlertTriangle } from "lucide-react";

type HealthData = {
  total: number;
  withoutProfile: number;
  withoutPets: number;
  withoutLocation: number;
  outdatedVersion: number;
  noVersion: number;
  latestVersion: string | null;
  versionsData: { version: string; count: number }[];
  profileCompletionRate: number;
  petOwnerRate: number;
};

function IssueRow({ icon: Icon, label, count, total, severity }: {
  icon: React.ElementType; label: string; count: number; total: number;
  severity: "low" | "medium" | "high";
}) {
  const pct = total > 0 ? Math.round((count / total) * 100) : 0;
  const colors = {
    low:    { bar: "bg-emerald-500", badge: "bg-emerald-100 text-emerald-700" },
    medium: { bar: "bg-amber-500",   badge: "bg-amber-100 text-amber-700" },
    high:   { bar: "bg-red-500",     badge: "bg-red-100 text-red-700" },
  }[severity];

  return (
    <div className="flex items-center gap-4 py-3 border-b last:border-0">
      <div className="w-8 h-8 rounded-lg bg-muted flex items-center justify-center flex-shrink-0">
        <Icon className="h-4 w-4 text-muted-foreground" />
      </div>
      <div className="flex-1 min-w-0">
        <p className="text-sm font-medium">{label}</p>
        <div className="mt-1.5 h-1.5 w-full rounded-full bg-muted overflow-hidden">
          <div className={`h-full rounded-full ${colors.bar}`} style={{ width: `${pct}%` }} />
        </div>
      </div>
      <div className="flex items-center gap-2 flex-shrink-0">
        <span className="text-sm font-mono font-bold">{count}</span>
        <span className={`text-xs px-1.5 py-0.5 rounded-full font-medium ${colors.badge}`}>{pct}%</span>
      </div>
    </div>
  );
}

export default function HealthClient({ data }: { data: HealthData }) {
  const score = Math.round(
    ((data.total - data.withoutProfile) / Math.max(data.total, 1)) * 30 +
    (data.petOwnerRate / 100) * 30 +
    ((data.total - data.outdatedVersion - data.noVersion) / Math.max(data.total, 1)) * 40
  );

  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-heading text-3xl font-bold">Saúde da Base</h1>
        <p className="text-muted-foreground text-sm mt-1">Qualidade e completude dos dados dos usuários</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* Score geral */}
        <Card className="md:col-span-1">
          <CardHeader>
            <CardTitle>Score de Saúde</CardTitle>
            <CardDescription>Qualidade geral da base de usuários</CardDescription>
          </CardHeader>
          <CardContent className="flex flex-col items-center gap-3 pb-6">
            <div className="relative w-32 h-32">
              <svg viewBox="0 0 36 36" className="w-full h-full -rotate-90">
                <circle cx="18" cy="18" r="15.9" fill="none" stroke="hsl(var(--muted))" strokeWidth="3" />
                <circle cx="18" cy="18" r="15.9" fill="none"
                  stroke={score >= 70 ? "hsl(142 70% 45%)" : score >= 40 ? "hsl(38 90% 55%)" : "hsl(0 72% 51%)"}
                  strokeWidth="3"
                  strokeDasharray={`${score} ${100 - score}`}
                  strokeLinecap="round"
                />
              </svg>
              <div className="absolute inset-0 flex flex-col items-center justify-center">
                <span className="text-3xl font-bold font-heading">{score}</span>
                <span className="text-xs text-muted-foreground">/ 100</span>
              </div>
            </div>
            <Badge className={score >= 70 ? "bg-emerald-100 text-emerald-700" : score >= 40 ? "bg-amber-100 text-amber-700" : "bg-red-100 text-red-700"}>
              {score >= 70 ? "Saudável" : score >= 40 ? "Atenção" : "Crítico"}
            </Badge>
          </CardContent>
        </Card>

        {/* Problemas encontrados */}
        <Card className="md:col-span-2">
          <CardHeader>
            <CardTitle>Problemas Encontrados</CardTitle>
            <CardDescription>Usuários com dados incompletos ou desatualizados</CardDescription>
          </CardHeader>
          <CardContent>
            <IssueRow icon={UserX}         label="Sem perfil criado"       count={data.withoutProfile}  total={data.total} severity={data.withoutProfile > data.total * 0.3 ? "high" : "medium"} />
            <IssueRow icon={PawPrint}      label="Sem pets cadastrados"    count={data.withoutPets}     total={data.total} severity={data.withoutPets > data.total * 0.5 ? "high" : "medium"} />
            <IssueRow icon={MapPin}        label="Sem localização"         count={data.withoutLocation} total={data.total} severity="low" />
            <IssueRow icon={Smartphone}    label="Versão desatualizada"    count={data.outdatedVersion} total={data.total} severity={data.outdatedVersion > data.total * 0.3 ? "high" : "medium"} />
            <IssueRow icon={AlertTriangle} label="Sem versão registrada"   count={data.noVersion}       total={data.total} severity="medium" />
          </CardContent>
        </Card>
      </div>

      {/* Versões em uso */}
      <Card>
        <CardHeader>
          <CardTitle>Versões do App em Uso</CardTitle>
          <CardDescription>
            Versão mais recente: {data.latestVersion ? `v${data.latestVersion}` : "—"}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={220}>
            <BarChart data={data.versionsData} margin={{ left: -10, right: 10 }}>
              <CartesianGrid strokeDasharray="3 3" className="stroke-border" />
              <XAxis dataKey="version" tick={{ fontSize: 12 }} />
              <YAxis tick={{ fontSize: 12 }} allowDecimals={false} />
              <Tooltip contentStyle={{ fontSize: 12, borderRadius: 8 }} />
              <Bar dataKey="count" name="Usuários" fill="hsl(174 60% 40%)" radius={[4,4,0,0]} />
            </BarChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>
    </div>
  );
}
