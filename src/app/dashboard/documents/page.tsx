import { supabaseAdmin } from "@/lib/supabase-admin";
import DocumentsClient from "./DocumentsClient";

export const revalidate = 60;

async function getDocuments() {
  const [{ data: docs }, { data: profiles }, { data: pets }] = await Promise.all([
    supabaseAdmin
      .from("pet_documents")
      .select("id, user_id, pet_id, title, type, date, note, created_at")
      .order("created_at", { ascending: false }),
    supabaseAdmin.from("user_profiles").select("user_id, name"),
    supabaseAdmin.from("pets").select("id, name, species"),
  ]);

  const profileMap: Record<string, string> = {};
  for (const p of profiles ?? []) profileMap[p.user_id] = p.name ?? "—";

  const petMap: Record<string, { name: string; species: string }> = {};
  for (const p of pets ?? []) petMap[p.id] = { name: p.name ?? "—", species: p.species ?? "—" };

  const typeCount: Record<string, number> = {};
  for (const d of docs ?? []) {
    const t = d.type ?? "other";
    typeCount[t] = (typeCount[t] ?? 0) + 1;
  }

  return {
    documents: (docs ?? []).map((d) => ({
      id: d.id,
      title: d.title ?? "—",
      type: d.type ?? "other",
      date: d.date,
      note: d.note,
      owner: profileMap[d.user_id] ?? "—",
      petName: petMap[d.pet_id]?.name ?? "—",
      petSpecies: petMap[d.pet_id]?.species ?? "—",
      createdAt: d.created_at,
    })),
    typeCount,
  };
}

export default async function DocumentsPage() {
  const data = await getDocuments();
  return <DocumentsClient documents={data.documents} typeCount={data.typeCount} />;
}
