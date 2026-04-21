"use client";

import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Separator } from "@/components/ui/separator";
import {
  ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
  ChartLegend,
  ChartLegendContent,
} from "@/components/ui/chart";
import {
  AreaChart, Area,
  BarChart, Bar,
  CartesianGrid, XAxis, YAxis,
  Cell, Pie, PieChart,
  ResponsiveContainer,
} from "recharts";
import {
  Users, PawPrint, TrendingUp, TrendingDown, Camera,
  MapPin, ShieldCheck, Heart, Stethoscope, Star, UserCheck, Trash2, Trophy,
} from "lucide-react";

type AnalyticsData = {
  totalUsers: number;
  totalPets: number;
  usersWithPets: number;
  conversionRate: number;
  newThisMonth: number;
  momGrowth: number | null;
  avgPetsPerUser: number;
  castrated: number;
  notCastrated: number;
  castrationData: { species: string; total: number; castrated: number; pct: number }[];
  userGrowthData: { month: string; Novos: number; Total: number }[];
  petMonthData: { month: string; Pets: number }[];
  photoMonthData: { month: string; Fotos: number }[];
  speciesData: { name: string; value: number }[];
  genderData: { name: string; value: number }[];
  ageBandData: { name: string; value: number }[];
  avgPetAgeYears: number | null;
  totalPhotos: number;
  photoRate: number;
  microchipRate: number;
  allergyRate: number;
  profileCompletenessRate: number;
  experienceData: { name: string; value: number }[];
  locationData: { name: string; value: number }[];
  countryData: { code: string; name: string; flag: string; count: number }[];
  internationalUsers: number;
  internationalRate: number;
  totalWithCountry: number;
  platformData: { name: string; value: number }[];
  deletionReasonData: { name: string; value: number }[];
  totalDeletions: number;
  totalMemorials: number;
  recentDeletions: { petName: string; petSpecies: string; reason: string; isMemorial: boolean; deletedAt: string }[];
  totalAchievementsUnlocked: number;
  usersWithAchievements: number;
  achievementEngagementRate: number;
  avgAchievementsPerUser: number;
  completionistRate: number;
  topAchievementsData: { id: string; title: string; group: string; count: number; pct: number }[];
  rareAchievementsData: { id: string; title: string; count: number; pct: number }[];
  achievementGroupData: { name: string; value: number }[];
  achievementMonthData: { month: string; Conquistas: number }[];
};

const PIE_COLORS = [
  "hsl(174 60% 40%)",
  "hsl(262 60% 58%)",
  "hsl(45 90% 55%)",
  "hsl(340 75% 58%)",
  "hsl(210 80% 55%)",
  "hsl(120 50% 45%)",
];

const growthConfig: ChartConfig = {
  Novos: { label: "Novos usuários", color: "hsl(174 60% 40%)" },
  Total: { label: "Total acumulado", color: "hsl(262 60% 58%)" },
};

const petConfig: ChartConfig = {
  Pets: { label: "Pets cadastrados", color: "hsl(45 90% 55%)" },
};

const photoConfig: ChartConfig = {
  Fotos: { label: "Fotos enviadas", color: "hsl(340 75% 58%)" },
};

const achievementConfig: ChartConfig = {
  Conquistas: { label: "Conquistas desbloqueadas", color: "hsl(45 90% 55%)" },
};

function KpiCard({
  icon: Icon,
  iconColor,
  iconBg,
  value,
  label,
  sub,
  subColor,
}: {
  icon: React.ElementType;
  iconColor: string;
  iconBg: string;
  value: string | number;
  label: string;
  sub?: string;
  subColor?: string;
}) {
  return (
    <Card>
      <CardContent className="pt-6">
        <div className="flex items-center gap-3">
          <div className={`w-10 h-10 rounded-lg flex items-center justify-center flex-shrink-0 ${iconBg}`}>
            <Icon className={`h-5 w-5 ${iconColor}`} />
          </div>
          <div className="min-w-0">
            <p className="text-2xl font-heading font-bold">{value}</p>
            <p className="text-xs text-muted-foreground">{label}</p>
            {sub && <p className={`text-xs font-medium mt-0.5 ${subColor ?? "text-muted-foreground"}`}>{sub}</p>}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

export default function AnalyticsClient({ data }: { data: AnalyticsData }) {
  const totalGender = data.genderData.reduce((a, b) => a + b.value, 0);
  const totalSpecies = data.speciesData.reduce((a, b) => a + b.value, 0);
  const totalAgeBands = data.ageBandData.reduce((a, b) => a + b.value, 0);
  const castratedPct = data.totalPets > 0 ? Math.round((data.castrated / data.totalPets) * 100) : 0;

  const momLabel = data.momGrowth !== null
    ? data.momGrowth > 0 ? `+${data.momGrowth}% vs mês anterior` : data.momGrowth === 0 ? "Igual ao mês anterior" : `${data.momGrowth}% vs mês anterior`
    : null;
  const momPositive = (data.momGrowth ?? 0) >= 0;

  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-heading text-3xl font-bold">Análises</h1>
        <p className="text-muted-foreground text-sm mt-1">Dados detalhados sobre usuários e pets do Zupet</p>
      </div>

      {/* KPIs principais — linha 1 */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <KpiCard
          icon={Users}
          iconBg="bg-primary/10"
          iconColor="text-primary"
          value={data.totalUsers}
          label="Usuários totais"
          sub={momLabel ?? undefined}
          subColor={momPositive ? "text-emerald-600" : "text-rose-500"}
        />
        <KpiCard
          icon={PawPrint}
          iconBg="bg-violet-500/10"
          iconColor="text-violet-600"
          value={data.totalPets}
          label="Pets cadastrados"
          sub={`Média: ${data.avgPetsPerUser} pets/usuário`}
        />
        <KpiCard
          icon={UserCheck}
          iconBg="bg-emerald-500/10"
          iconColor="text-emerald-600"
          value={`${data.conversionRate}%`}
          label="Taxa de conversão"
          sub={`${data.usersWithPets} usuários com pets`}
        />
        <KpiCard
          icon={data.momGrowth !== null && data.momGrowth >= 0 ? TrendingUp : TrendingDown}
          iconBg="bg-amber-500/10"
          iconColor="text-amber-600"
          value={`+${data.newThisMonth}`}
          label="Novos este mês"
          sub={momLabel ?? undefined}
          subColor={momPositive ? "text-emerald-600" : "text-rose-500"}
        />
      </div>

      {/* KPIs de engajamento — linha 2 */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <KpiCard
          icon={Camera}
          iconBg="bg-rose-500/10"
          iconColor="text-rose-500"
          value={`${data.photoRate}%`}
          label="Pets com fotos"
          sub={`${data.totalPhotos} fotos no total`}
        />
        <KpiCard
          icon={ShieldCheck}
          iconBg="bg-teal-500/10"
          iconColor="text-teal-600"
          value={`${castratedPct}%`}
          label="Pets castrados"
          sub={`${data.castrated} de ${data.totalPets}`}
        />
        <KpiCard
          icon={Stethoscope}
          iconBg="bg-blue-500/10"
          iconColor="text-blue-600"
          value={`${data.microchipRate}%`}
          label="Com microchip"
          sub="Identificação registrada"
        />
        <KpiCard
          icon={Heart}
          iconBg="bg-pink-500/10"
          iconColor="text-pink-500"
          value={`${data.allergyRate}%`}
          label="Com alergias/restrições"
          sub="Dados de saúde preenchidos"
        />
      </div>

      {/* Crescimento de usuários */}
      <Card>
        <CardHeader>
          <CardTitle>Crescimento de Usuários</CardTitle>
          <CardDescription>Novos cadastros e total acumulado nos últimos 12 meses</CardDescription>
        </CardHeader>
        <CardContent>
          <ChartContainer config={growthConfig} className="h-64 w-full">
            <AreaChart data={data.userGrowthData} margin={{ left: 0, right: 0, top: 4, bottom: 0 }}>
              <defs>
                <linearGradient id="gNovos" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="hsl(174 60% 40%)" stopOpacity={0.2} />
                  <stop offset="95%" stopColor="hsl(174 60% 40%)" stopOpacity={0} />
                </linearGradient>
                <linearGradient id="gTotal" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="hsl(262 60% 58%)" stopOpacity={0.15} />
                  <stop offset="95%" stopColor="hsl(262 60% 58%)" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid vertical={false} stroke="hsl(var(--border))" />
              <XAxis dataKey="month" tickLine={false} axisLine={false} tick={{ fontSize: 11, fill: "hsl(var(--muted-foreground))" }} />
              <YAxis tickLine={false} axisLine={false} tick={{ fontSize: 11, fill: "hsl(var(--muted-foreground))" }} width={28} />
              <ChartTooltip content={<ChartTooltipContent />} />
              <ChartLegend content={<ChartLegendContent />} />
              <Area type="monotone" dataKey="Total" stroke="hsl(262 60% 58%)" strokeWidth={2} fill="url(#gTotal)" dot={false} />
              <Area type="monotone" dataKey="Novos" stroke="hsl(174 60% 40%)" strokeWidth={2} fill="url(#gNovos)" dot={false} />
            </AreaChart>
          </ChartContainer>
        </CardContent>
      </Card>

      {/* Pets por mês + Fotos por mês */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <Card>
          <CardHeader>
            <CardTitle>Pets Cadastrados por Mês</CardTitle>
            <CardDescription>Novos pets nos últimos 6 meses</CardDescription>
          </CardHeader>
          <CardContent>
            <ChartContainer config={petConfig} className="h-48 w-full">
              <BarChart data={data.petMonthData} margin={{ left: 0, right: 0, top: 4, bottom: 0 }}>
                <CartesianGrid vertical={false} stroke="hsl(var(--border))" />
                <XAxis dataKey="month" tickLine={false} axisLine={false} tick={{ fontSize: 11, fill: "hsl(var(--muted-foreground))" }} />
                <YAxis tickLine={false} axisLine={false} tick={{ fontSize: 11, fill: "hsl(var(--muted-foreground))" }} width={24} allowDecimals={false} />
                <ChartTooltip content={<ChartTooltipContent />} />
                <Bar dataKey="Pets" fill="hsl(45 90% 55%)" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ChartContainer>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Fotos Enviadas por Mês</CardTitle>
            <CardDescription>Engajamento: fotos dos pets nos últimos 6 meses</CardDescription>
          </CardHeader>
          <CardContent>
            <ChartContainer config={photoConfig} className="h-48 w-full">
              <BarChart data={data.photoMonthData} margin={{ left: 0, right: 0, top: 4, bottom: 0 }}>
                <CartesianGrid vertical={false} stroke="hsl(var(--border))" />
                <XAxis dataKey="month" tickLine={false} axisLine={false} tick={{ fontSize: 11, fill: "hsl(var(--muted-foreground))" }} />
                <YAxis tickLine={false} axisLine={false} tick={{ fontSize: 11, fill: "hsl(var(--muted-foreground))" }} width={24} allowDecimals={false} />
                <ChartTooltip content={<ChartTooltipContent />} />
                <Bar dataKey="Fotos" fill="hsl(340 75% 58%)" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ChartContainer>
          </CardContent>
        </Card>
      </div>

      {/* Gênero + Faixas etárias */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <Card>
          <CardHeader>
            <CardTitle>Distribuição por Gênero</CardTitle>
            <CardDescription>Proporção de machos e fêmeas</CardDescription>
          </CardHeader>
          <CardContent>
            {data.genderData.length === 0 ? (
              <div className="h-48 flex items-center justify-center text-sm text-muted-foreground">Sem dados</div>
            ) : (
              <div className="flex items-center gap-6 h-48">
                <ResponsiveContainer width={140} height="100%">
                  <PieChart>
                    <Pie data={data.genderData} cx="50%" cy="50%" innerRadius={40} outerRadius={62} dataKey="value" paddingAngle={3}>
                      {data.genderData.map((_, i) => <Cell key={i} fill={PIE_COLORS[i % PIE_COLORS.length]} />)}
                    </Pie>
                    <ChartTooltip formatter={(v, n) => [v, n]} />
                  </PieChart>
                </ResponsiveContainer>
                <div className="flex-1 space-y-3">
                  {data.genderData.map((g, i) => {
                    const pct = totalGender > 0 ? Math.round((g.value / totalGender) * 100) : 0;
                    return (
                      <div key={g.name}>
                        <div className="flex items-center justify-between text-sm mb-1.5">
                          <div className="flex items-center gap-2">
                            <span className="w-2.5 h-2.5 rounded-full" style={{ background: PIE_COLORS[i % PIE_COLORS.length] }} />
                            <span className="font-medium">{g.name}</span>
                          </div>
                          <span className="text-muted-foreground text-xs">{g.value} ({pct}%)</span>
                        </div>
                        <Progress value={pct} className="h-1.5" />
                      </div>
                    );
                  })}
                </div>
              </div>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <div>
              <CardTitle>Faixas Etárias dos Pets</CardTitle>
              <CardDescription>
                {data.avgPetAgeYears !== null
                  ? `Idade média: ${data.avgPetAgeYears} anos`
                  : "Distribuição por idade"}
              </CardDescription>
            </div>
          </CardHeader>
          <CardContent>
            {data.ageBandData.length === 0 ? (
              <div className="h-48 flex items-center justify-center text-sm text-muted-foreground">Sem dados de idade</div>
            ) : (
              <div className="flex items-center gap-6 h-48">
                <ResponsiveContainer width={140} height="100%">
                  <PieChart>
                    <Pie data={data.ageBandData} cx="50%" cy="50%" innerRadius={40} outerRadius={62} dataKey="value" paddingAngle={3}>
                      {data.ageBandData.map((_, i) => <Cell key={i} fill={PIE_COLORS[i % PIE_COLORS.length]} />)}
                    </Pie>
                    <ChartTooltip formatter={(v, n) => [v, n]} />
                  </PieChart>
                </ResponsiveContainer>
                <div className="flex-1 space-y-3">
                  {data.ageBandData.map((b, i) => {
                    const pct = totalAgeBands > 0 ? Math.round((b.value / totalAgeBands) * 100) : 0;
                    return (
                      <div key={b.name}>
                        <div className="flex items-center justify-between text-sm mb-1.5">
                          <div className="flex items-center gap-2">
                            <span className="w-2.5 h-2.5 rounded-full" style={{ background: PIE_COLORS[i % PIE_COLORS.length] }} />
                            <span className="font-medium text-xs">{b.name}</span>
                          </div>
                          <span className="text-muted-foreground text-xs">{b.value} ({pct}%)</span>
                        </div>
                        <Progress value={pct} className="h-1.5" />
                      </div>
                    );
                  })}
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Castração por espécie */}
      <Card>
        <CardHeader>
          <CardTitle>Castração por Espécie</CardTitle>
          <CardDescription>Taxa de castração discriminada por tipo de animal</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {data.castrationData.length === 0 ? (
            <p className="text-sm text-muted-foreground text-center py-6">Sem dados</p>
          ) : (
            data.castrationData.map((c, i) => (
              <div key={c.species} className="space-y-1.5">
                <div className="flex items-center justify-between text-sm">
                  <div className="flex items-center gap-2">
                    <span className="text-xs text-muted-foreground font-mono w-5">#{i + 1}</span>
                    <span className="font-medium">{c.species}</span>
                    <span className="text-xs text-muted-foreground">({c.total} pets)</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-xs text-muted-foreground">{c.castrated} castrados</span>
                    <Badge
                      variant="outline"
                      className={`text-xs ${c.pct >= 70 ? "border-emerald-500/30 text-emerald-600 bg-emerald-500/5" : c.pct >= 40 ? "border-amber-500/30 text-amber-600 bg-amber-500/5" : "border-rose-500/30 text-rose-500 bg-rose-500/5"}`}
                    >
                      {c.pct}%
                    </Badge>
                  </div>
                </div>
                <div className="h-2 bg-secondary rounded-full overflow-hidden">
                  <div
                    className="h-full rounded-full transition-all"
                    style={{
                      width: `${c.pct}%`,
                      background: c.pct >= 70 ? "hsl(142 60% 45%)" : c.pct >= 40 ? "hsl(45 90% 55%)" : "hsl(340 75% 58%)",
                    }}
                  />
                </div>
              </div>
            ))
          )}
        </CardContent>
      </Card>

      {/* Espécies + Localização */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <Card>
          <CardHeader>
            <CardTitle>Espécies Populares</CardTitle>
            <CardDescription>Ranking completo de espécies cadastradas</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {data.speciesData.length === 0 ? (
              <p className="text-sm text-muted-foreground text-center py-6">Nenhum pet ainda</p>
            ) : (
              data.speciesData.map((s, i) => {
                const pct = totalSpecies > 0 ? Math.round((s.value / totalSpecies) * 100) : 0;
                return (
                  <div key={s.name} className="space-y-1.5">
                    <div className="flex items-center justify-between text-sm">
                      <div className="flex items-center gap-2">
                        <span className="text-xs text-muted-foreground font-mono w-5">#{i + 1}</span>
                        <span className="font-medium">{s.name}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="text-xs text-muted-foreground">{pct}%</span>
                        <span className="font-semibold w-4 text-right">{s.value}</span>
                      </div>
                    </div>
                    <div className="h-2 bg-secondary rounded-full overflow-hidden">
                      <div className="h-full rounded-full" style={{ width: `${pct}%`, background: PIE_COLORS[i % PIE_COLORS.length] }} />
                    </div>
                  </div>
                );
              })
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <div className="flex items-center gap-2">
              <MapPin className="h-4 w-4 text-muted-foreground" />
              <div>
                <CardTitle>Distribuição Geográfica</CardTitle>
                <CardDescription>Usuários por estado (Brasil)</CardDescription>
              </div>
            </div>
          </CardHeader>
          <CardContent className="space-y-3">
            {data.locationData.length === 0 ? (
              <p className="text-sm text-muted-foreground text-center py-6">Sem dados de localização</p>
            ) : (
              data.locationData.map((loc, i) => {
                const maxVal = data.locationData[0]?.value ?? 1;
                const pct = Math.round((loc.value / maxVal) * 100);
                return (
                  <div key={loc.name} className="flex items-center gap-3">
                    <span className="text-xs text-muted-foreground font-mono w-5">#{i + 1}</span>
                    <div className="flex-1 space-y-1">
                      <div className="flex justify-between text-sm">
                        <span className="font-medium">{loc.name}</span>
                        <span className="text-muted-foreground">{loc.value}</span>
                      </div>
                      <Progress value={pct} className="h-1.5" />
                    </div>
                  </div>
                );
              })
            )}
          </CardContent>
        </Card>
      </div>

      {/* Distribuição por país */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <MapPin className="h-4 w-4 text-muted-foreground" />
              <div>
                <CardTitle>Alcance Internacional</CardTitle>
                <CardDescription>
                  Usuários por país —{" "}
                  {data.totalWithCountry === 0
                    ? "nenhum dado ainda"
                    : `${data.totalWithCountry} usuários informaram o país`}
                </CardDescription>
              </div>
            </div>
            {data.totalWithCountry > 0 && (
              <div className="text-right">
                <p className="text-2xl font-bold">{data.internationalRate}%</p>
                <p className="text-xs text-muted-foreground">fora do Brasil</p>
              </div>
            )}
          </div>
        </CardHeader>
        <CardContent>
          {data.countryData.length === 0 ? (
            <p className="text-sm text-muted-foreground text-center py-8">
              Nenhum usuário informou o país ainda. Os dados aparecerão aqui após a atualização do app.
            </p>
          ) : (
            <div className="space-y-3">
              {data.countryData.map((c, i) => {
                const maxVal = data.countryData[0]?.count ?? 1;
                const pct = Math.round((c.count / maxVal) * 100);
                const isBR = c.code === "BR";
                return (
                  <div key={c.code} className="flex items-center gap-3">
                    <span className="text-xs text-muted-foreground font-mono w-5">#{i + 1}</span>
                    <span className="text-xl w-7">{c.flag}</span>
                    <div className="flex-1 space-y-1">
                      <div className="flex justify-between text-sm">
                        <div className="flex items-center gap-2">
                          <span className="font-medium">{c.name}</span>
                          {isBR && (
                            <Badge variant="outline" className="text-[10px] px-1.5 py-0 h-4">BR</Badge>
                          )}
                          {!isBR && (
                            <Badge variant="secondary" className="text-[10px] px-1.5 py-0 h-4">Internacional</Badge>
                          )}
                        </div>
                        <span className="text-muted-foreground font-mono">{c.count}</span>
                      </div>
                      <Progress
                        value={pct}
                        className="h-2"
                        style={{ "--progress-color": isBR ? "hsl(174 60% 40%)" : "hsl(262 60% 58%)" } as React.CSSProperties}
                      />
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Qualidade de dados: perfil + experiência */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <Card>
          <CardHeader>
            <CardTitle>Qualidade dos Dados</CardTitle>
            <CardDescription>Completude dos perfis e informações de saúde</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {[
              { label: "Perfil completo do usuário", value: data.profileCompletenessRate, desc: "cidade, estado, data de nasc., experiência" },
              { label: "Pets com fotos", value: data.photoRate, desc: "engajamento visual" },
              { label: "Pets com microchip", value: data.microchipRate, desc: "identificação registrada" },
              { label: "Pets com dados de saúde", value: data.allergyRate, desc: "alergias ou restrições informadas" },
            ].map(({ label, value, desc }) => (
              <div key={label} className="space-y-1.5">
                <div className="flex items-center justify-between text-sm">
                  <div>
                    <span className="font-medium">{label}</span>
                    <p className="text-xs text-muted-foreground">{desc}</p>
                  </div>
                  <Badge
                    variant="outline"
                    className={`text-xs ml-2 flex-shrink-0 ${value >= 70 ? "border-emerald-500/30 text-emerald-600 bg-emerald-500/5" : value >= 40 ? "border-amber-500/30 text-amber-600 bg-amber-500/5" : "border-rose-500/30 text-rose-500 bg-rose-500/5"}`}
                  >
                    {value}%
                  </Badge>
                </div>
                <Progress value={value} className="h-1.5" />
              </div>
            ))}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <div className="flex items-center gap-2">
              <Star className="h-4 w-4 text-muted-foreground" />
              <div>
                <CardTitle>Experiência dos Usuários</CardTitle>
                <CardDescription>Perfil de conhecimento com pets</CardDescription>
              </div>
            </div>
          </CardHeader>
          <CardContent className="space-y-3">
            {data.experienceData.length === 0 ? (
              <p className="text-sm text-muted-foreground text-center py-6">Sem dados de experiência</p>
            ) : (() => {
              const total = data.experienceData.reduce((a, b) => a + b.value, 0);
              return data.experienceData.map((e, i) => {
                const pct = total > 0 ? Math.round((e.value / total) * 100) : 0;
                return (
                  <div key={e.name} className="flex items-center gap-3">
                    <span className="text-xs text-muted-foreground font-mono w-5">#{i + 1}</span>
                    <div className="flex-1 space-y-1">
                      <div className="flex justify-between text-sm">
                        <span className="font-medium">{e.name}</span>
                        <span className="text-muted-foreground">{e.value} ({pct}%)</span>
                      </div>
                      <Progress value={pct} className="h-1.5" />
                    </div>
                  </div>
                );
              });
            })()}
          </CardContent>
        </Card>
      </div>

      {/* Exclusões de pets */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <Card>
          <CardHeader>
            <div className="flex items-center gap-2">
              <Trash2 className="h-4 w-4 text-muted-foreground" />
              <div>
                <CardTitle>Motivos de Exclusão</CardTitle>
                <CardDescription>
                  {data.totalDeletions} excluídos · {data.totalMemorials} memoriais
                </CardDescription>
              </div>
            </div>
          </CardHeader>
          <CardContent className="space-y-3">
            {data.deletionReasonData.length === 0 ? (
              <p className="text-sm text-muted-foreground text-center py-6">Nenhuma exclusão registrada</p>
            ) : (() => {
              const total = data.deletionReasonData.reduce((a, b) => a + b.value, 0);
              return data.deletionReasonData.map((r, i) => {
                const pct = total > 0 ? Math.round((r.value / total) * 100) : 0;
                return (
                  <div key={r.name} className="flex items-center gap-3">
                    <span className="text-xs text-muted-foreground font-mono w-5">#{i + 1}</span>
                    <div className="flex-1 space-y-1">
                      <div className="flex justify-between text-sm">
                        <span className="font-medium">{r.name}</span>
                        <span className="text-muted-foreground">{r.value} ({pct}%)</span>
                      </div>
                      <div className="h-2 bg-secondary rounded-full overflow-hidden">
                        <div className="h-full rounded-full" style={{ width: `${pct}%`, background: PIE_COLORS[i % PIE_COLORS.length] }} />
                      </div>
                    </div>
                  </div>
                );
              });
            })()}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Exclusões Recentes</CardTitle>
            <CardDescription>Últimos 10 pets removidos ou marcados como memorial</CardDescription>
          </CardHeader>
          <CardContent>
            {data.recentDeletions.length === 0 ? (
              <p className="text-sm text-muted-foreground text-center py-6">Nenhuma exclusão registrada</p>
            ) : (
              <div className="space-y-2">
                {data.recentDeletions.map((d, i) => (
                  <div key={i} className="flex items-center justify-between py-1.5 border-b last:border-0 border-border/50">
                    <div className="min-w-0">
                      <p className="text-sm font-medium truncate">
                        {d.isMemorial ? "🌈 " : ""}{d.petName}
                        <span className="text-muted-foreground font-normal"> · {d.petSpecies}</span>
                      </p>
                      <p className="text-xs text-muted-foreground">{d.reason}</p>
                    </div>
                    <span className="text-xs text-muted-foreground ml-3 flex-shrink-0">
                      {new Date(d.deletedAt).toLocaleDateString("pt-BR", { day: "2-digit", month: "short" })}
                    </span>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Conquistas */}
      <div>
        <h2 className="font-heading text-xl font-semibold mb-4 flex items-center gap-2">
          <Trophy className="h-5 w-5 text-amber-500" />
          Conquistas
        </h2>

        {/* KPIs de conquistas */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
          <KpiCard
            icon={Trophy}
            iconBg="bg-amber-500/10"
            iconColor="text-amber-500"
            value={data.totalAchievementsUnlocked}
            label="Total desbloqueadas"
            sub={`Média: ${data.avgAchievementsPerUser} por usuário`}
          />
          <KpiCard
            icon={Users}
            iconBg="bg-violet-500/10"
            iconColor="text-violet-600"
            value={`${data.achievementEngagementRate}%`}
            label="Usuários engajados"
            sub={`${data.usersWithAchievements} com ≥1 conquista`}
          />
          <KpiCard
            icon={Star}
            iconBg="bg-emerald-500/10"
            iconColor="text-emerald-600"
            value={`${data.completionistRate}%`}
            label="Completistas"
            sub="Desbloquearam tudo"
          />
          <KpiCard
            icon={TrendingUp}
            iconBg="bg-rose-500/10"
            iconColor="text-rose-500"
            value={data.achievementMonthData[data.achievementMonthData.length - 1]?.Conquistas ?? 0}
            label="Unlocks este mês"
            sub="Conquistas desbloqueadas"
          />
        </div>

        {/* Unlocks por mês + Distribuição por grupo */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 mb-4">
          <Card>
            <CardHeader>
              <CardTitle>Unlocks por Mês</CardTitle>
              <CardDescription>Conquistas desbloqueadas nos últimos 6 meses</CardDescription>
            </CardHeader>
            <CardContent>
              <ChartContainer config={achievementConfig} className="h-48 w-full">
                <BarChart data={data.achievementMonthData} margin={{ left: 0, right: 0, top: 4, bottom: 0 }}>
                  <CartesianGrid vertical={false} stroke="hsl(var(--border))" />
                  <XAxis dataKey="month" tickLine={false} axisLine={false} tick={{ fontSize: 11, fill: "hsl(var(--muted-foreground))" }} />
                  <YAxis tickLine={false} axisLine={false} tick={{ fontSize: 11, fill: "hsl(var(--muted-foreground))" }} width={24} allowDecimals={false} />
                  <ChartTooltip content={<ChartTooltipContent />} />
                  <Bar dataKey="Conquistas" fill="hsl(45 90% 55%)" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ChartContainer>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Distribuição por Categoria</CardTitle>
              <CardDescription>Quais grupos de conquistas são mais desbloqueados</CardDescription>
            </CardHeader>
            <CardContent className="space-y-3">
              {data.achievementGroupData.length === 0 ? (
                <p className="text-sm text-muted-foreground text-center py-6">Sem dados ainda</p>
              ) : (() => {
                const total = data.achievementGroupData.reduce((a, b) => a + b.value, 0);
                return data.achievementGroupData.map((g, i) => {
                  const pct = total > 0 ? Math.round((g.value / total) * 100) : 0;
                  return (
                    <div key={g.name} className="flex items-center gap-3">
                      <span className="text-xs text-muted-foreground font-mono w-5">#{i + 1}</span>
                      <div className="flex-1 space-y-1">
                        <div className="flex justify-between text-sm">
                          <span className="font-medium">{g.name}</span>
                          <span className="text-muted-foreground">{g.value} ({pct}%)</span>
                        </div>
                        <div className="h-2 bg-secondary rounded-full overflow-hidden">
                          <div className="h-full rounded-full" style={{ width: `${pct}%`, background: PIE_COLORS[i % PIE_COLORS.length] }} />
                        </div>
                      </div>
                    </div>
                  );
                });
              })()}
            </CardContent>
          </Card>
        </div>

        {/* Top conquistas + Conquistas raras */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          <Card>
            <CardHeader>
              <CardTitle>Mais Desbloqueadas</CardTitle>
              <CardDescription>Conquistas com maior taxa de unlock entre usuários</CardDescription>
            </CardHeader>
            <CardContent className="space-y-3">
              {data.topAchievementsData.length === 0 ? (
                <p className="text-sm text-muted-foreground text-center py-6">Sem dados ainda</p>
              ) : (
                data.topAchievementsData.map((a, i) => (
                  <div key={a.id} className="flex items-center gap-3">
                    <span className="text-xs text-muted-foreground font-mono w-5">#{i + 1}</span>
                    <div className="flex-1 space-y-1">
                      <div className="flex justify-between text-sm">
                        <div>
                          <span className="font-medium">{a.title}</span>
                          <span className="text-xs text-muted-foreground ml-2">{a.group}</span>
                        </div>
                        <span className="text-muted-foreground text-xs">{a.count} ({a.pct}%)</span>
                      </div>
                      <div className="h-2 bg-secondary rounded-full overflow-hidden">
                        <div className="h-full rounded-full bg-amber-400" style={{ width: `${a.pct}%` }} />
                      </div>
                    </div>
                  </div>
                ))
              )}
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Conquistas Raras</CardTitle>
              <CardDescription>As mais difíceis de desbloquear</CardDescription>
            </CardHeader>
            <CardContent className="space-y-3">
              {data.rareAchievementsData.length === 0 ? (
                <p className="text-sm text-muted-foreground text-center py-6">Sem dados ainda</p>
              ) : (
                data.rareAchievementsData.map((a, i) => (
                  <div key={a.id} className="flex items-center gap-3">
                    <span className="text-xs text-muted-foreground font-mono w-5">#{i + 1}</span>
                    <div className="flex-1 space-y-1">
                      <div className="flex justify-between text-sm">
                        <span className="font-medium">{a.title}</span>
                        <Badge
                          variant="outline"
                          className="text-xs border-rose-500/30 text-rose-500 bg-rose-500/5"
                        >
                          {a.pct}% dos usuários
                        </Badge>
                      </div>
                      <div className="h-2 bg-secondary rounded-full overflow-hidden">
                        <div
                          className="h-full rounded-full bg-rose-400"
                          style={{ width: `${Math.max(a.pct, 2)}%` }}
                        />
                      </div>
                    </div>
                  </div>
                ))
              )}
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Plataforma (Android vs iOS) */}
      <Card>
        <CardHeader>
          <CardTitle>Plataforma dos Usuários</CardTitle>
          <CardDescription>Distribuição Android vs iOS — coletado automaticamente pelo app</CardDescription>
        </CardHeader>
        <CardContent>
          {data.platformData.filter(p => p.name !== "Não informado").length === 0 ? (
            <p className="text-sm text-muted-foreground text-center py-6">
              Sem dados de plataforma ainda — disponível após próxima atualização do app
            </p>
          ) : (
            <div className="flex items-center gap-8">
              <ResponsiveContainer width={160} height={160}>
                <PieChart>
                  <Pie data={data.platformData.filter(p => p.name !== "Não informado")} cx="50%" cy="50%" innerRadius={45} outerRadius={70} dataKey="value" paddingAngle={3}>
                    {data.platformData.filter(p => p.name !== "Não informado").map((_, i) => (
                      <Cell key={i} fill={i === 0 ? "hsl(142 60% 45%)" : "hsl(210 80% 55%)"} />
                    ))}
                  </Pie>
                  <ChartTooltip formatter={(v, n) => [v, n]} />
                </PieChart>
              </ResponsiveContainer>
              <div className="flex-1 space-y-4">
                {data.platformData.map((p, i) => {
                  const known = data.platformData.filter(x => x.name !== "Não informado").reduce((a, b) => a + b.value, 0);
                  const total = data.platformData.reduce((a, b) => a + b.value, 0);
                  const base = p.name === "Não informado" ? total : known;
                  const pct = base > 0 ? Math.round((p.value / base) * 100) : 0;
                  const color = p.name === "Android" ? "hsl(142 60% 45%)" : p.name === "iOS" ? "hsl(210 80% 55%)" : "hsl(var(--muted-foreground))";
                  return (
                    <div key={p.name}>
                      <div className="flex items-center justify-between text-sm mb-1.5">
                        <div className="flex items-center gap-2">
                          <span className="w-2.5 h-2.5 rounded-full" style={{ background: color }} />
                          <span className="font-medium">{p.name}</span>
                        </div>
                        <span className="text-muted-foreground text-xs">{p.value} ({pct}%)</span>
                      </div>
                      <Progress value={pct} className="h-1.5" />
                    </div>
                  );
                })}
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
