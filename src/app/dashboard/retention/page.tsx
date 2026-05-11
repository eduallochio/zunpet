import { supabaseAdmin } from "@/lib/supabase-admin";
import RetentionClient from "./RetentionClient";

export const revalidate = 300;

async function getRetentionData() {
  const now = new Date();
  const days7  = new Date(now.getTime() - 7  * 24 * 60 * 60 * 1000);
  const days30 = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
  const days60 = new Date(now.getTime() - 60 * 24 * 60 * 60 * 1000);
  const days90 = new Date(now.getTime() - 90 * 24 * 60 * 60 * 1000);

  const [
    { data: profiles },
    { data: { users: authUsers } },
  ] = await Promise.all([
    supabaseAdmin.from("user_profiles").select("user_id, updated_at, app_version"),
    supabaseAdmin.auth.admin.listUsers({ perPage: 1000 }),
  ]);

  const profileMap: Record<string, { updated_at: string; app_version: string | null }> = {};
  for (const p of profiles ?? []) profileMap[p.user_id] = p;

  const total = authUsers.length;

  // Ativos = abriram o app (updated_at atualizado) nos últimos N dias
  const active7  = (profiles ?? []).filter(p => new Date(p.updated_at) >= days7).length;
  const active30 = (profiles ?? []).filter(p => new Date(p.updated_at) >= days30).length;
  const active90 = (profiles ?? []).filter(p => new Date(p.updated_at) >= days90).length;

  // Novos por semana — últimas 8 semanas
  const weeklyData: Record<string, { label: string; novos: number; ativos: number }> = {};
  for (let i = 7; i >= 0; i--) {
    const weekStart = new Date(now.getTime() - (i + 1) * 7 * 24 * 60 * 60 * 1000);
    const weekEnd   = new Date(now.getTime() - i * 7 * 24 * 60 * 60 * 1000);
    const label = `S${8 - i}`;
    const novos  = authUsers.filter(u => new Date(u.created_at) >= weekStart && new Date(u.created_at) < weekEnd).length;
    const ativos = (profiles ?? []).filter(p => new Date(p.updated_at) >= weekStart && new Date(p.updated_at) < weekEnd).length;
    weeklyData[label] = { label, novos, ativos };
  }

  // Taxa de retenção D30 — dos que cadastraram há 30-60 dias, quantos ainda usam
  const cohort30 = authUsers.filter(u => new Date(u.created_at) >= days60 && new Date(u.created_at) < days30);
  const retained30 = cohort30.filter(u => {
    const p = profileMap[u.id];
    return p && new Date(p.updated_at) >= days30;
  }).length;
  const retention30Rate = cohort30.length > 0 ? Math.round((retained30 / cohort30.length) * 100) : 0;

  // Novos este mês vs mês passado
  const newThisMonth = authUsers.filter(u => new Date(u.created_at) >= days30).length;
  const newLastMonth = authUsers.filter(u => new Date(u.created_at) >= days60 && new Date(u.created_at) < days30).length;
  const growthRate = newLastMonth > 0 ? Math.round(((newThisMonth - newLastMonth) / newLastMonth) * 100) : 0;

  // Usuários sem nenhuma atividade (nunca atualizaram perfil)
  const neverActive = authUsers.filter(u => !profileMap[u.id]).length;

  return {
    total,
    active7,
    active30,
    active90,
    newThisMonth,
    newLastMonth,
    growthRate,
    retention30Rate,
    neverActive,
    weeklyChart: Object.values(weeklyData),
  };
}

export default async function RetentionPage() {
  const data = await getRetentionData();
  return <RetentionClient data={data} />;
}
