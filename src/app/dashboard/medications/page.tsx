import { supabaseAdmin } from "@/lib/supabase-admin";
import MedicationsClient from "./MedicationsClient";

export const revalidate = 60;

async function getMedications() {
  const [{ data: meds }, { data: profiles }, { data: pets }] = await Promise.all([
    supabaseAdmin
      .from("pet_medications")
      .select("id, user_id, pet_id, name, dosage, frequency, start_date, end_date, vet, note, active, created_at")
      .order("created_at", { ascending: false }),
    supabaseAdmin.from("user_profiles").select("user_id, name"),
    supabaseAdmin.from("pets").select("id, name, species"),
  ]);

  const profileMap: Record<string, string> = {};
  for (const p of profiles ?? []) profileMap[p.user_id] = p.name ?? "—";

  const petMap: Record<string, { name: string; species: string }> = {};
  for (const p of pets ?? []) petMap[p.id] = { name: p.name ?? "—", species: p.species ?? "—" };

  const active = (meds ?? []).filter((m) => m.active).length;

  return {
    medications: (meds ?? []).map((m) => ({
      id: m.id,
      name: m.name ?? "—",
      dosage: m.dosage ?? "—",
      frequency: m.frequency ?? "—",
      startDate: m.start_date,
      endDate: m.end_date,
      vet: m.vet,
      note: m.note,
      active: m.active ?? false,
      owner: profileMap[m.user_id] ?? "—",
      petName: petMap[m.pet_id]?.name ?? "—",
      petSpecies: petMap[m.pet_id]?.species ?? "—",
      createdAt: m.created_at,
    })),
    activeCount: active,
  };
}

export default async function MedicationsPage() {
  const data = await getMedications();
  return <MedicationsClient medications={data.medications} activeCount={data.activeCount} />;
}
