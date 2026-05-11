"use client";

import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from "recharts";
import { MapPin } from "lucide-react";

type GeoData = {
  topCities:    { name: string; count: number }[];
  topStates:    { name: string; count: number }[];
  topCountries: { name: string; count: number }[];
  withLocation: number;
  total: number;
};

const BAR_COLORS = [
  "hsl(174 60% 40%)", "hsl(174 60% 48%)", "hsl(174 60% 54%)",
  "hsl(174 60% 58%)", "hsl(174 60% 62%)", "hsl(174 60% 66%)",
  "hsl(174 60% 70%)", "hsl(174 60% 74%)", "hsl(174 60% 78%)", "hsl(174 60% 82%)",
];

export default function GeoClient({ data }: { data: GeoData }) {
  const locationRate = data.total > 0 ? Math.round((data.withLocation / data.total) * 100) : 0;

  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-heading text-3xl font-bold">Dados Geográficos</h1>
        <p className="text-muted-foreground text-sm mt-1">Distribuição dos usuários por localização</p>
      </div>

      {/* Cobertura */}
      <Card>
        <CardContent className="pt-6">
          <div className="flex items-center gap-4">
            <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
              <MapPin className="h-5 w-5 text-primary" />
            </div>
            <div className="flex-1">
              <p className="text-sm text-muted-foreground">Usuários com localização</p>
              <div className="flex items-center gap-3 mt-1">
                <span className="text-2xl font-bold font-heading">{data.withLocation}</span>
                <Badge variant="outline">{locationRate}% da base</Badge>
              </div>
              <div className="mt-2 h-2 w-full rounded-full bg-muted overflow-hidden">
                <div className="h-full rounded-full bg-primary" style={{ width: `${locationRate}%` }} />
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {/* Top cidades */}
        <Card>
          <CardHeader>
            <CardTitle>Top 10 Cidades</CardTitle>
            <CardDescription>Cidades com mais usuários cadastrados</CardDescription>
          </CardHeader>
          <CardContent>
            {data.topCities.length === 0 ? (
              <p className="text-sm text-muted-foreground text-center py-8">Nenhum dado de cidade disponível</p>
            ) : (
              <ResponsiveContainer width="100%" height={280}>
                <BarChart data={data.topCities} layout="vertical" margin={{ left: 0, right: 20 }}>
                  <CartesianGrid strokeDasharray="3 3" className="stroke-border" horizontal={false} />
                  <XAxis type="number" tick={{ fontSize: 12 }} allowDecimals={false} />
                  <YAxis type="category" dataKey="name" tick={{ fontSize: 11 }} width={90} />
                  <Tooltip contentStyle={{ fontSize: 12, borderRadius: 8 }} />
                  <Bar dataKey="count" name="Usuários" radius={[0,4,4,0]}>
                    {data.topCities.map((_, i) => <Cell key={i} fill={BAR_COLORS[i]} />)}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            )}
          </CardContent>
        </Card>

        {/* Top estados */}
        <Card>
          <CardHeader>
            <CardTitle>Top Estados / Regiões</CardTitle>
            <CardDescription>Distribuição por estado ou região</CardDescription>
          </CardHeader>
          <CardContent>
            {data.topStates.length === 0 ? (
              <p className="text-sm text-muted-foreground text-center py-8">Nenhum dado de estado disponível</p>
            ) : (
              <div className="space-y-2">
                {data.topStates.map((s, i) => {
                  const maxCount = data.topStates[0]?.count ?? 1;
                  const pct = Math.round((s.count / maxCount) * 100);
                  return (
                    <div key={s.name} className="flex items-center gap-3">
                      <span className="text-xs font-mono text-muted-foreground w-4">{i + 1}</span>
                      <span className="text-sm font-medium w-12">{s.name}</span>
                      <div className="flex-1 h-6 rounded-md bg-muted overflow-hidden">
                        <div className="h-full rounded-md bg-primary/70 flex items-center pl-2" style={{ width: `${pct}%` }}>
                          {pct > 20 && <span className="text-xs text-white font-medium">{s.count}</span>}
                        </div>
                      </div>
                      {pct <= 20 && <span className="text-xs text-muted-foreground w-6">{s.count}</span>}
                    </div>
                  );
                })}
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Países */}
      {data.topCountries.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>Distribuição por País</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex flex-wrap gap-3">
              {data.topCountries.map((c) => (
                <div key={c.name} className="flex items-center gap-2 px-3 py-2 rounded-lg border bg-card">
                  <span className="text-sm font-medium">{c.name}</span>
                  <Badge variant="secondary">{c.count}</Badge>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
