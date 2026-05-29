import { supabaseAdmin } from "@/lib/supabase-admin";
import EmergencyContactsClient from "./EmergencyContactsClient";

export const revalidate = 60;

async function getEmergencyContacts() {
  const [{ data: contacts }, { data: profiles }, { data: pets }] = await Promise.all([
    supabaseAdmin
      .from("emergency_contacts")
      .select("id, user_id, pet_id, type, name, phone, address, notes, created_at")
      .order("created_at", { ascending: false }),
    supabaseAdmin.from("user_profiles").select("user_id, name"),
    supabaseAdmin.from("pets").select("id, name, species"),
  ]);

  const profileMap: Record<string, string> = {};
  for (const p of profiles ?? []) profileMap[p.user_id] = p.name ?? "—";

  const petMap: Record<string, { name: string; species: string }> = {};
  for (const p of pets ?? []) petMap[p.id] = { name: p.name ?? "—", species: p.species ?? "—" };

  const typeCount: Record<string, number> = {};
  for (const c of contacts ?? []) {
    const t = c.type ?? "other";
    typeCount[t] = (typeCount[t] ?? 0) + 1;
  }

  return {
    contacts: (contacts ?? []).map((c) => ({
      id: c.id,
      type: c.type ?? "other",
      name: c.name ?? "—",
      phone: c.phone ?? "—",
      address: c.address,
      notes: c.notes,
      owner: profileMap[c.user_id] ?? "—",
      petName: petMap[c.pet_id]?.name ?? "—",
      petSpecies: petMap[c.pet_id]?.species ?? "—",
      createdAt: c.created_at,
    })),
    typeCount,
  };
}

export default async function EmergencyContactsPage() {
  const data = await getEmergencyContacts();
  return <EmergencyContactsClient contacts={data.contacts} typeCount={data.typeCount} />;
}
