import { supabaseAdmin } from "@/lib/supabase-admin";
import PrescriptionsClient from "./PrescriptionsClient";

export const revalidate = 60;

async function getPrescriptions() {
  const [{ data: prescriptions }, { data: profiles }, { data: pets }] = await Promise.all([
    supabaseAdmin
      .from("pet_prescriptions")
      .select("id, user_id, pet_id, vet_name, clinic_name, consult_date, expiry_date, medications, dosage, duration, notes, created_at")
      .order("consult_date", { ascending: false }),
    supabaseAdmin.from("user_profiles").select("user_id, name"),
    supabaseAdmin.from("pets").select("id, name, species"),
  ]);

  const profileMap: Record<string, string> = {};
  for (const p of profiles ?? []) profileMap[p.user_id] = p.name ?? "—";

  const petMap: Record<string, { name: string; species: string }> = {};
  for (const p of pets ?? []) petMap[p.id] = { name: p.name ?? "—", species: p.species ?? "—" };

  const now = new Date();
  const active = (prescriptions ?? []).filter(
    (p) => !p.expiry_date || new Date(p.expiry_date) >= now
  ).length;

  return {
    prescriptions: (prescriptions ?? []).map((p) => ({
      id: p.id,
      vetName: p.vet_name ?? "—",
      clinicName: p.clinic_name,
      consultDate: p.consult_date,
      expiryDate: p.expiry_date,
      medications: p.medications ?? "—",
      dosage: p.dosage,
      duration: p.duration,
      notes: p.notes,
      owner: profileMap[p.user_id] ?? "—",
      petName: petMap[p.pet_id]?.name ?? "—",
      petSpecies: petMap[p.pet_id]?.species ?? "—",
      createdAt: p.created_at,
    })),
    activeCount: active,
  };
}

export default async function PrescriptionsPage() {
  const data = await getPrescriptions();
  return <PrescriptionsClient prescriptions={data.prescriptions} activeCount={data.activeCount} />;
}
