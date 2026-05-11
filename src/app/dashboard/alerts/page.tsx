import { supabaseAdmin } from "@/lib/supabase-admin";
import AlertsClient from "./AlertsClient";

export const revalidate = 120;

async function getAlertsData() {
  const now = new Date();
  const days30  = new Date(now.getTime() - 30  * 24 * 60 * 60 * 1000);
  const days7   = new Date(now.getTime() - 7   * 24 * 60 * 60 * 1000);
  const days2   = new Date(now.getTime() - 2   * 24 * 60 * 60 * 1000);
  const days90  = new Date(now.getTime() - 90  * 24 * 60 * 60 * 1000);

  const [
    { data: profiles },
    { data: { users: authUsers } },
  ] = await Promise.all([
    supabaseAdmin.from("user_profiles").select("user_id, app_version, updated_at, platform"),
    supabaseAdmin.auth.admin.listUsers({ perPage: 1000 }),
  ]);

  const profileMap: Record<string, any> = {};
  for (const p of profiles ?? []) profileMap[p.user_id] = p;

  // Novos cadastros por dia (últimos 14 dias)
  const dailySignups: Record<string, number> = {};
  for (let i = 13; i >= 0; i--) {
    const d = new Date(now.getTime() - i * 24 * 60 * 60 * 1000);
    const key = d.toISOString().slice(0, 10);
    dailySignups[key] = 0;
  }
  for (const u of authUsers) {
    const key = u.created_at.slice(0, 10);
    if (dailySignups[key] !== undefined) dailySignups[key]++;
  }
  const dailyChart = Object.entries(dailySignups).map(([date, count]) => ({
    date: date.slice(5), // MM-DD
    cadastros: count,
  }));

  // Média diária
  const avgDaily = Math.round(Object.values(dailySignups).reduce((a, b) => a + b, 0) / 14);

  // Pico (maior dia)
  const peakEntry = Object.entries(dailySignups).sort((a, b) => b[1] - a[1])[0];
  const peakDay   = peakEntry ? { date: peakEntry[0], count: peakEntry[1] } : null;

  // Inativos há mais de 30 dias (com perfil mas não abriu recentemente)
  const inactive30 = (profiles ?? []).filter(p => new Date(p.updated_at) < days30).length;
  const inactive90 = (profiles ?? []).filter(p => new Date(p.updated_at) < days90).length;

  // Novos últimas 48h
  const newLast2Days = authUsers.filter(u => new Date(u.created_at) >= days2).length;

  // Novos últimos 7 dias
  const newLast7Days = authUsers.filter(u => new Date(u.created_at) >= days7).length;

  // Versão mais usada
  const versionCount: Record<string, number> = {};
  for (const p of profiles ?? []) {
    if (p.app_version) versionCount[p.app_version] = (versionCount[p.app_version] ?? 0) + 1;
  }
  const latestVersion = Object.entries(versionCount).sort((a, b) => b[1] - a[1])[0]?.[0] ?? null;
  const outdated = latestVersion
    ? (profiles ?? []).filter(p => p.app_version && p.app_version !== latestVersion).length
    : 0;

  // Alertas
  const alerts: { type: "danger" | "warning" | "info"; title: string; description: string }[] = [];

  if (peakDay && peakDay.count > avgDaily * 3 && peakDay.count >= 5) {
    alerts.push({ type: "info", title: "Pico de cadastros detectado", description: `${peakDay.date}: ${peakDay.count} cadastros (${Math.round(peakDay.count / Math.max(avgDaily, 1))}x a média diária de ${avgDaily})` });
  }
  if (inactive30 > authUsers.length * 0.4) {
    alerts.push({ type: "warning", title: "Alta taxa de inatividade", description: `${inactive30} usuários (${Math.round(inactive30 / Math.max(authUsers.length, 1) * 100)}%) não abrem o app há mais de 30 dias` });
  }
  if (outdated > authUsers.length * 0.3) {
    alerts.push({ type: "warning", title: "Muitos usuários desatualizados", description: `${outdated} usuários ainda não atualizaram para v${latestVersion}` });
  }
  if (newLast2Days >= 5) {
    alerts.push({ type: "info", title: "Crescimento recente", description: `${newLast2Days} novos usuários nas últimas 48 horas` });
  }
  if (alerts.length === 0) {
    alerts.push({ type: "info", title: "Tudo tranquilo", description: "Nenhum alerta operacional no momento." });
  }

  return {
    alerts,
    inactive30,
    inactive90,
    newLast2Days,
    newLast7Days,
    avgDaily,
    peakDay,
    outdated,
    latestVersion,
    dailyChart,
    total: authUsers.length,
  };
}

export default async function AlertsPage() {
  const data = await getAlertsData();
  return <AlertsClient data={data} />;
}
