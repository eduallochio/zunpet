import { supabaseAdmin } from "@/lib/supabase-admin";
import VaccinationsClient from "./VaccinationsClient";

export const revalidate = 60;

async function getVaccinations() {
  const [{ data: vaccinations }, { data: profiles }, { data: pets }] = await Promise.all([
    supabaseAdmin
      .from("vaccinations")
      .select("id, user_id, pet_id, vaccine_name, date_administered, next_due_date, created_at")
      .order("date_administered", { ascending: false }),
    supabaseAdmin.from("user_profiles").select("user_id, name"),
    supabaseAdmin.from("pets").select("id, name, species"),
  ]);

  const profileMap: Record<string, string> = {};
  for (const p of profiles ?? []) profileMap[p.user_id] = p.name ?? "—";

  const petMap: Record<string, { name: string; species: string }> = {};
  for (const p of pets ?? []) petMap[p.id] = { name: p.name ?? "—", species: p.species ?? "—" };

  const now = new Date();
  const overdue = (vaccinations ?? []).filter((v) => v.next_due_date && new Date(v.next_due_date) < now).length;
  const upcoming30 = (vaccinations ?? []).filter((v) => {
    if (!v.next_due_date) return false;
    const d = new Date(v.next_due_date);
    const diff = (d.getTime() - now.getTime()) / (1000 * 60 * 60 * 24);
    return diff >= 0 && diff <= 30;
  }).length;

  return {
    vaccinations: (vaccinations ?? []).map((v) => ({
      id: v.id,
      vaccineName: v.vaccine_name ?? "—",
      dateAdministered: v.date_administered,
      nextDueDate: v.next_due_date,
      owner: profileMap[v.user_id] ?? "—",
      petName: petMap[v.pet_id]?.name ?? "—",
      petSpecies: petMap[v.pet_id]?.species ?? "—",
      createdAt: v.created_at,
    })),
    overdue,
    upcoming30,
  };
}

export default async function VaccinationsPage() {
  const data = await getVaccinations();
  return <VaccinationsClient vaccinations={data.vaccinations} overdue={data.overdue} upcoming30={data.upcoming30} />;
}
