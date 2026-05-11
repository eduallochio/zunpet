import { supabaseAdmin } from "@/lib/supabase-admin";
import UsageClient from "./UsageClient";

export const revalidate = 300;

async function getUsageData() {
  const now = new Date();
  const months: string[] = [];
  for (let i = 5; i >= 0; i--) {
    const d = new Date(now.getFullYear(), now.getMonth() - i, 1);
    months.push(`${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}`);
  }

  const [
    { data: reminders },
    { data: vaccinations },
    { data: achievements },
    { data: medications },
    { data: diary },
  ] = await Promise.all([
    supabaseAdmin.from("reminders").select("category, created_at"),
    supabaseAdmin.from("vaccinations").select("date_administered"),
    supabaseAdmin.from("user_achievements").select("unlocked_at"),
    supabaseAdmin.from("pet_medications").select("id"),
    supabaseAdmin.from("pet_diary").select("created_at"),
  ]);

  // Lembretes por categoria
  const remindersByCategory: Record<string, number> = {};
  for (const r of reminders ?? []) {
    remindersByCategory[r.category] = (remindersByCategory[r.category] ?? 0) + 1;
  }
  const remindersCategoryData = Object.entries(remindersByCategory)
    .map(([name, value]) => ({ name, value }))
    .sort((a, b) => b.value - a.value);

  // Vacinas por mês (últimos 6 meses)
  const vaccinesByMonth: Record<string, number> = {};
  for (const m of months) vaccinesByMonth[m] = 0;
  for (const v of vaccinations ?? []) {
    const parts = v.date_administered?.split("/");
    if (parts?.length === 3) {
      const key = `${parts[2]}-${parts[1]}`;
      if (vaccinesByMonth[key] !== undefined) vaccinesByMonth[key]++;
    }
  }
  const vaccinesChartData = months.map(m => ({
    mes: m.slice(5) + "/" + m.slice(2, 4),
    vacinas: vaccinesByMonth[m] ?? 0,
  }));

  // Conquistas por mês
  const achievementsByMonth: Record<string, number> = {};
  for (const m of months) achievementsByMonth[m] = 0;
  for (const a of achievements ?? []) {
    const key = a.unlocked_at?.slice(0, 7);
    if (key && achievementsByMonth[key] !== undefined) achievementsByMonth[key]++;
  }
  const achievementsChartData = months.map(m => ({
    mes: m.slice(5) + "/" + m.slice(2, 4),
    conquistas: achievementsByMonth[m] ?? 0,
  }));

  return {
    totalReminders: reminders?.length ?? 0,
    totalVaccinations: vaccinations?.length ?? 0,
    totalAchievements: achievements?.length ?? 0,
    totalMedications: medications?.length ?? 0,
    totalDiary: diary?.length ?? 0,
    remindersCategoryData,
    vaccinesChartData,
    achievementsChartData,
  };
}

export default async function UsagePage() {
  const data = await getUsageData();
  return <UsageClient data={data} />;
}
