"use client";

import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip,
  LineChart, Line, ResponsiveContainer, Cell,
} from "recharts";
import { Bell, Syringe, Trophy, Pill, BookOpen } from "lucide-react";

type UsageData = {
  totalReminders: number;
  totalVaccinations: number;
  totalAchievements: number;
  totalMedications: number;
  totalDiary: number;
  remindersCategoryData: { name: string; value: number }[];
  vaccinesChartData: { mes: string; vacinas: number }[];
  achievementsChartData: { mes: string; conquistas: number }[];
};

const CATEGORY_COLORS: Record<string, string> = {
  "Saúde":      "hsl(142 70% 45%)",
  "Higiene":    "hsl(210 80% 55%)",
  "Consulta":   "hsl(262 60% 58%)",
  "Prevenção":  "hsl(38 90% 55%)",
  "Outro":      "hsl(0 0% 60%)",
};

function StatCard({ title, value, icon: Icon, color }: {
  title: string; value: number; icon: React.ElementType; color: string;
}) {
  return (
    <Card>
      <CardHeader className="pb-2 flex flex-row items-center justify-between space-y-0">
        <CardTitle className="text-sm font-medium text-muted-foreground">{title}</CardTitle>
        <div className={`w-9 h-9 rounded-lg flex items-center justify-center ${color}`}>
          <Icon className="h-5 w-5" />
        </div>
      </CardHeader>
      <CardContent>
        <p className="text-3xl font-heading font-bold">{value.toLocaleString("pt-BR")}</p>
      </CardContent>
    </Card>
  );
}

export default function UsageClient({ data }: { data: UsageData }) {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-heading text-3xl font-bold">Métricas de Uso</h1>
        <p className="text-muted-foreground text-sm mt-1">O que os usuários estão registrando no app</p>
      </div>

      {/* Totais */}
      <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
        <StatCard title="Lembretes"   value={data.totalReminders}   icon={Bell}    color="bg-amber-500/10 text-amber-600" />
        <StatCard title="Vacinas"     value={data.totalVaccinations} icon={Syringe} color="bg-emerald-500/10 text-emerald-600" />
        <StatCard title="Conquistas"  value={data.totalAchievements} icon={Trophy}  color="bg-violet-500/10 text-violet-600" />
        <StatCard title="Medicamentos" value={data.totalMedications} icon={Pill}    color="bg-blue-500/10 text-blue-600" />
        <StatCard title="Diário"      value={data.totalDiary}        icon={BookOpen} color="bg-rose-500/10 text-rose-600" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {/* Lembretes por categoria */}
        <Card>
          <CardHeader>
            <CardTitle>Lembretes por Categoria</CardTitle>
            <CardDescription>Distribuição de todos os lembretes criados</CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={240}>
              <BarChart data={data.remindersCategoryData} layout="vertical" margin={{ left: 0, right: 20 }}>
                <CartesianGrid strokeDasharray="3 3" className="stroke-border" horizontal={false} />
                <XAxis type="number" tick={{ fontSize: 12 }} allowDecimals={false} />
                <YAxis type="category" dataKey="name" tick={{ fontSize: 12 }} width={70} />
                <Tooltip contentStyle={{ fontSize: 12, borderRadius: 8 }} />
                <Bar dataKey="value" name="Total" radius={[0, 4, 4, 0]}>
                  {data.remindersCategoryData.map((entry) => (
                    <Cell key={entry.name} fill={CATEGORY_COLORS[entry.name] ?? "hsl(174 60% 40%)"} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Vacinas por mês */}
        <Card>
          <CardHeader>
            <CardTitle>Vacinas Registradas por Mês</CardTitle>
            <CardDescription>Evolução dos registros de vacinação</CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={240}>
              <LineChart data={data.vaccinesChartData} margin={{ left: -10, right: 10 }}>
                <CartesianGrid strokeDasharray="3 3" className="stroke-border" />
                <XAxis dataKey="mes" tick={{ fontSize: 12 }} />
                <YAxis tick={{ fontSize: 12 }} allowDecimals={false} />
                <Tooltip contentStyle={{ fontSize: 12, borderRadius: 8 }} />
                <Line type="monotone" dataKey="vacinas" name="Vacinas" stroke="hsl(142 70% 45%)" strokeWidth={2} dot={{ r: 4 }} />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Conquistas por mês */}
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle>Conquistas Desbloqueadas por Mês</CardTitle>
            <CardDescription>Engajamento com o sistema de gamificação</CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={200}>
              <BarChart data={data.achievementsChartData} margin={{ left: -10, right: 10 }}>
                <CartesianGrid strokeDasharray="3 3" className="stroke-border" />
                <XAxis dataKey="mes" tick={{ fontSize: 12 }} />
                <YAxis tick={{ fontSize: 12 }} allowDecimals={false} />
                <Tooltip contentStyle={{ fontSize: 12, borderRadius: 8 }} />
                <Bar dataKey="conquistas" name="Conquistas" fill="hsl(262 60% 58%)" radius={[4,4,0,0]} />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
