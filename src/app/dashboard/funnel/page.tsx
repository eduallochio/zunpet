import { supabaseAdmin } from "@/lib/supabase-admin";
import FunnelClient from "./FunnelClient";

export const revalidate = 300;

async function getFunnelData() {
  const [
    { data: { users: authUsers } },
    { data: pets },
    { data: reminders },
    { data: vaccinations },
    { data: weights },
    { data: photos },
  ] = await Promise.all([
    supabaseAdmin.auth.admin.listUsers({ perPage: 1000 }),
    supabaseAdmin.from("pets").select("user_id"),
    supabaseAdmin.from("reminders").select("user_id"),
    supabaseAdmin.from("vaccinations").select("user_id"),
    supabaseAdmin.from("weight_records").select("user_id"),
    supabaseAdmin.from("pet_photos").select("user_id"),
  ]);

  const total = authUsers.length;

  const usersWithPets      = new Set((pets ?? []).map(p => p.user_id)).size;
  const usersWithReminders = new Set((reminders ?? []).map(r => r.user_id)).size;
  const usersWithVaccines  = new Set((vaccinations ?? []).map(v => v.user_id)).size;
  const usersWithWeight    = new Set((weights ?? []).map(w => w.user_id)).size;
  const usersWithPhotos    = new Set((photos ?? []).map(p => p.user_id)).size;

  const steps = [
    { label: "Cadastraram conta",      count: total,             pct: 100 },
    { label: "Cadastraram um pet",     count: usersWithPets,     pct: total > 0 ? Math.round((usersWithPets / total) * 100) : 0 },
    { label: "Criaram lembrete",       count: usersWithReminders,pct: total > 0 ? Math.round((usersWithReminders / total) * 100) : 0 },
    { label: "Registraram vacina",     count: usersWithVaccines, pct: total > 0 ? Math.round((usersWithVaccines / total) * 100) : 0 },
    { label: "Registraram peso",       count: usersWithWeight,   pct: total > 0 ? Math.round((usersWithWeight / total) * 100) : 0 },
    { label: "Adicionaram foto",       count: usersWithPhotos,   pct: total > 0 ? Math.round((usersWithPhotos / total) * 100) : 0 },
  ];

  // Drop-off entre etapas
  const dropoffs = steps.slice(1).map((step, i) => ({
    label: `${steps[i].label} → ${step.label}`,
    lost: steps[i].count - step.count,
    pct: steps[i].count > 0 ? Math.round(((steps[i].count - step.count) / steps[i].count) * 100) : 0,
  }));

  return { total, steps, dropoffs };
}

export default async function FunnelPage() {
  const data = await getFunnelData();
  return <FunnelClient data={data} />;
}
