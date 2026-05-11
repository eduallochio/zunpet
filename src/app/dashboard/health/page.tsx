import { supabaseAdmin } from "@/lib/supabase-admin";
import HealthClient from "./HealthClient";

export const revalidate = 300;

async function getHealthData() {
  const [
    { data: profiles },
    { data: pets },
    { data: { users: authUsers } },
  ] = await Promise.all([
    supabaseAdmin.from("user_profiles").select("user_id, name, city, state, app_version, platform, updated_at"),
    supabaseAdmin.from("pets").select("user_id"),
    supabaseAdmin.auth.admin.listUsers({ perPage: 1000 }),
  ]);

  const profileMap: Record<string, any> = {};
  for (const p of profiles ?? []) profileMap[p.user_id] = p;

  const petOwners = new Set((pets ?? []).map(p => p.user_id));

  // Versão mais recente (do maior número de usuários com versão)
  const versionCount: Record<string, number> = {};
  for (const p of profiles ?? []) {
    if (p.app_version) versionCount[p.app_version] = (versionCount[p.app_version] ?? 0) + 1;
  }
  const latestVersion = Object.entries(versionCount).sort((a, b) => b[1] - a[1])[0]?.[0] ?? null;

  const total = authUsers.length;
  const withoutProfile   = authUsers.filter(u => !profileMap[u.id]).length;
  const withoutPets      = authUsers.filter(u => !petOwners.has(u.id)).length;
  const withoutLocation  = (profiles ?? []).filter(p => !p.city && !p.state).length;
  const outdatedVersion  = latestVersion
    ? (profiles ?? []).filter(p => p.app_version && p.app_version !== latestVersion).length
    : 0;
  const noVersion        = (profiles ?? []).filter(p => !p.app_version).length;

  // Versões em uso
  const versionsData = Object.entries(versionCount)
    .map(([version, count]) => ({ version: `v${version}`, count }))
    .sort((a, b) => b.count - a.count)
    .slice(0, 8);

  return {
    total,
    withoutProfile,
    withoutPets,
    withoutLocation,
    outdatedVersion,
    noVersion,
    latestVersion,
    versionsData,
    profileCompletionRate: total > 0 ? Math.round(((total - withoutProfile) / total) * 100) : 0,
    petOwnerRate: total > 0 ? Math.round((petOwners.size / total) * 100) : 0,
  };
}

export default async function HealthPage() {
  const data = await getHealthData();
  return <HealthClient data={data} />;
}
