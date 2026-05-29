import { supabaseAdmin } from "@/lib/supabase-admin";
import FeedingsClient from "./FeedingsClient";

export const revalidate = 60;

async function getFeedings() {
  const [{ data: feedings }, { data: profiles }, { data: pets }] = await Promise.all([
    supabaseAdmin
      .from("pet_feedings")
      .select("id, user_id, pet_id, brand, daily_amount, last_refill_date, note, created_at")
      .order("created_at", { ascending: false }),
    supabaseAdmin.from("user_profiles").select("user_id, name"),
    supabaseAdmin.from("pets").select("id, name, species"),
  ]);

  const profileMap: Record<string, string> = {};
  for (const p of profiles ?? []) profileMap[p.user_id] = p.name ?? "—";

  const petMap: Record<string, { name: string; species: string }> = {};
  for (const p of pets ?? []) petMap[p.id] = { name: p.name ?? "—", species: p.species ?? "—" };

  const brandCount: Record<string, number> = {};
  for (const f of feedings ?? []) {
    if (f.brand) brandCount[f.brand] = (brandCount[f.brand] ?? 0) + 1;
  }
  const topBrands = Object.entries(brandCount).sort((a, b) => b[1] - a[1]).slice(0, 5);

  return {
    feedings: (feedings ?? []).map((f) => ({
      id: f.id,
      brand: f.brand ?? "—",
      dailyAmount: f.daily_amount ?? "—",
      lastRefillDate: f.last_refill_date,
      note: f.note,
      owner: profileMap[f.user_id] ?? "—",
      petName: petMap[f.pet_id]?.name ?? "—",
      petSpecies: petMap[f.pet_id]?.species ?? "—",
      createdAt: f.created_at,
    })),
    topBrands,
  };
}

export default async function FeedingsPage() {
  const data = await getFeedings();
  return <FeedingsClient feedings={data.feedings} topBrands={data.topBrands} />;
}
