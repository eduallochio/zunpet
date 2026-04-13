import { supabaseAdmin } from "@/lib/supabase-admin";
import UsersClient from "./UsersClient";

export const revalidate = 60;

async function getUsers() {
  const [{ data: profiles }, { data: petRows }, { data: { users: authUsers } }] = await Promise.all([
    supabaseAdmin.from("user_profiles").select("user_id, name, city, state, platform, updated_at").order("updated_at", { ascending: false }),
    supabaseAdmin.from("pets").select("user_id"),
    supabaseAdmin.auth.admin.listUsers(),
  ]);

  const emailMap: Record<string, { email: string; created_at: string }> = {};
  for (const u of authUsers) emailMap[u.id] = { email: u.email ?? "", created_at: u.created_at };

  const countMap: Record<string, number> = {};
  for (const p of petRows ?? []) countMap[p.user_id] = (countMap[p.user_id] ?? 0) + 1;

  return (profiles ?? []).map((p) => ({
    id: p.user_id,
    name: p.name ?? "—",
    email: emailMap[p.user_id]?.email ?? "—",
    location: p.city && p.state ? `${p.city}, ${p.state}` : p.city ?? p.state ?? "—",
    pets: countMap[p.user_id] ?? 0,
    createdAt: emailMap[p.user_id]?.created_at ?? p.updated_at,
    platform: (p.platform as "android" | "ios" | null) ?? null,
  }));
}

export default async function UsersPage() {
  const users = await getUsers();
  return <UsersClient users={users} />;
}
