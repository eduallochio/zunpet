"use client";

import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import {
  Table, TableBody, TableCell, TableHead, TableHeader, TableRow,
} from "@/components/ui/table";
import {
  ChartConfig,
  ChartContainer,
  ChartTooltip,
} from "@/components/ui/chart";
import { Cell, Pie, PieChart, ResponsiveContainer } from "recharts";
import { PawPrint, Calendar } from "lucide-react";

type Pet = {
  id: string;
  name: string;
  species: string;
  breed: string;
  age: string;
  gender: string;
  castrated: boolean;
  owner: string;
  emoji: string;
  createdAt: string;
};

const PIE_COLORS = [
  "hsl(174 60% 40%)",
  "hsl(262 60% 58%)",
  "hsl(45 90% 55%)",
  "hsl(340 75% 58%)",
  "hsl(210 80% 55%)",
];

const chartConfig: ChartConfig = {};

export default function PetsClient({
  pets,
  speciesData,
}: {
  pets: Pet[];
  speciesData: { name: string; value: number }[];
}) {
  const total = speciesData.reduce((a, b) => a + b.value, 0);
  const sorted = [...speciesData].sort((a, b) => b.value - a.value);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-heading text-3xl font-bold">Pets</h1>
        <p className="text-muted-foreground text-sm mt-1">Todos os pets cadastrados nas contas do Zupet</p>
      </div>

      {/* KPIs */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
                <PawPrint className="h-5 w-5 text-primary" />
              </div>
              <div>
                <p className="text-2xl font-heading font-bold">{pets.length}</p>
                <p className="text-xs text-muted-foreground">Total de pets</p>
              </div>
            </div>
          </CardContent>
        </Card>
        {sorted.slice(0, 3).map((s, i) => (
          <Card key={s.name}>
            <CardContent className="pt-6">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-lg bg-secondary flex items-center justify-center text-xl">
                  {s.name.toLowerCase().includes("cachorro") ? "🐶"
                    : s.name.toLowerCase().includes("gato") ? "🐱"
                    : s.name.toLowerCase().includes("ssaro") ? "🐦"
                    : s.name.toLowerCase().includes("coelho") ? "🐰"
                    : "🐾"}
                </div>
                <div>
                  <p className="text-2xl font-heading font-bold">{s.value}</p>
                  <p className="text-xs text-muted-foreground">{s.name}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Charts */}
      {sorted.length > 0 && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          <Card>
            <CardHeader>
              <CardTitle>Distribuição por Espécie</CardTitle>
              <CardDescription>Proporção de cada tipo de animal</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex items-center gap-6">
                <ResponsiveContainer width={160} height={160}>
                  <PieChart>
                    <Pie data={sorted} cx="50%" cy="50%" innerRadius={45} outerRadius={72} dataKey="value" paddingAngle={2}>
                      {sorted.map((_, i) => (
                        <Cell key={i} fill={PIE_COLORS[i % PIE_COLORS.length]} />
                      ))}
                    </Pie>
                    <ChartTooltip formatter={(v, n) => [v, n]} />
                  </PieChart>
                </ResponsiveContainer>
                <div className="flex-1 space-y-2.5">
                  {sorted.map((s, i) => {
                    const pct = total > 0 ? Math.round((s.value / total) * 100) : 0;
                    return (
                      <div key={s.name}>
                        <div className="flex items-center justify-between text-sm mb-1">
                          <div className="flex items-center gap-2">
                            <span className="w-2.5 h-2.5 rounded-full" style={{ background: PIE_COLORS[i % PIE_COLORS.length] }} />
                            <span className="font-medium">{s.name}</span>
                          </div>
                          <span className="text-muted-foreground text-xs">{s.value} ({pct}%)</span>
                        </div>
                        <Progress value={pct} className="h-1.5" />
                      </div>
                    );
                  })}
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Ranking de Espécies</CardTitle>
              <CardDescription>Espécies mais populares</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {sorted.map((s, i) => {
                const pct = total > 0 ? Math.round((s.value / total) * 100) : 0;
                return (
                  <div key={s.name} className="space-y-1.5">
                    <div className="flex items-center justify-between text-sm">
                      <div className="flex items-center gap-2">
                        <span className="text-muted-foreground text-xs font-mono w-4">#{i + 1}</span>
                        <span className="font-medium">{s.name}</span>
                      </div>
                      <span className="font-semibold">{s.value}</span>
                    </div>
                    <div className="h-2 bg-secondary rounded-full overflow-hidden">
                      <div className="h-full rounded-full transition-all" style={{ width: `${pct}%`, background: PIE_COLORS[i % PIE_COLORS.length] }} />
                    </div>
                  </div>
                );
              })}
            </CardContent>
          </Card>
        </div>
      )}

      {/* Table */}
      <Card>
        <CardHeader>
          <CardTitle>Todos os Pets</CardTitle>
        </CardHeader>
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="pl-6">Nome</TableHead>
                <TableHead>Espécie / Raça</TableHead>
                <TableHead>Idade</TableHead>
                <TableHead>Gênero</TableHead>
                <TableHead>Dono</TableHead>
                <TableHead className="pr-6">Cadastrado</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {pets.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={6} className="text-center text-muted-foreground py-12 text-sm">
                    Nenhum pet cadastrado ainda
                  </TableCell>
                </TableRow>
              ) : (
                pets.map((pet) => (
                  <TableRow key={pet.id}>
                    <TableCell className="pl-6">
                      <div className="flex items-center gap-3">
                        <span className="text-xl">{pet.emoji}</span>
                        <span className="text-sm font-medium">{pet.name}</span>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <Badge variant="outline" className="text-xs">{pet.species}</Badge>
                        {pet.breed !== "—" && <span className="text-xs text-muted-foreground">{pet.breed}</span>}
                      </div>
                    </TableCell>
                    <TableCell className="text-sm text-muted-foreground">{pet.age}</TableCell>
                    <TableCell className="text-sm text-muted-foreground capitalize">{pet.gender}</TableCell>
                    <TableCell className="text-sm text-muted-foreground">{pet.owner}</TableCell>
                    <TableCell className="pr-6">
                      <div className="flex items-center gap-1 text-sm text-muted-foreground">
                        <Calendar className="h-3 w-3" />
                        {new Date(pet.createdAt).toLocaleDateString("pt-BR")}
                      </div>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}
