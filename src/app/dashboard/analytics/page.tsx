import { supabaseAdmin } from "@/lib/supabase-admin";
import AnalyticsClient from "./AnalyticsClient";

export const revalidate = 60; // ISR: regenera a página a cada 60 segundos

function monthLabel(date: Date) {
  return date.toLocaleDateString("pt-BR", { month: "short", year: "2-digit" });
}

function parseDob(dob: string): Date | null {
  if (!dob) return null;
  const parts = dob.split("/");
  if (parts.length !== 3) return null;
  const [d, m, y] = parts;
  const date = new Date(`${y}-${m}-${d}`);
  return isNaN(date.getTime()) ? null : date;
}

async function getAnalytics() {
  const [
    { data: pets },
    { data: profiles },
    { data: photos },
    { data: { users: authUsers } },
  ] = await Promise.all([
    supabaseAdmin.from("pets").select("id, user_id, species, gender, castrated, dob, microchip, food_allergies, med_allergies, restrictions, created_at"),
    supabaseAdmin.from("user_profiles").select("user_id, city, state, birth_date, experience, name, platform, updated_at"),
    supabaseAdmin.from("pet_photos").select("id, pet_id, created_at"),
    supabaseAdmin.auth.admin.listUsers(),
  ]);

  const now = new Date();
  const allPets = pets ?? [];
  const allProfiles = profiles ?? [];
  const allPhotos = photos ?? [];

  // ── Crescimento acumulado de usuários (12 meses) ──────────────────────────
  const userGrowthMap: Record<string, number> = {};
  for (let i = 11; i >= 0; i--) {
    const d = new Date(now.getFullYear(), now.getMonth() - i, 1);
    userGrowthMap[monthLabel(d)] = 0;
  }
  for (const u of authUsers) {
    const label = monthLabel(new Date(u.created_at));
    if (label in userGrowthMap) userGrowthMap[label]++;
  }
  let acc = 0;
  const userGrowthData = Object.entries(userGrowthMap).map(([month, novos]) => {
    acc += novos;
    return { month, Novos: novos, Total: acc };
  });

  // MoM growth (mês atual vs anterior)
  const lastTwo = userGrowthData.slice(-2);
  const momGrowth = lastTwo.length === 2 && lastTwo[0].Novos > 0
    ? Math.round(((lastTwo[1].Novos - lastTwo[0].Novos) / lastTwo[0].Novos) * 100)
    : null;
  const newThisMonth = userGrowthData[userGrowthData.length - 1]?.Novos ?? 0;

  // ── Cadastros de pets por mês (6 meses) ───────────────────────────────────
  const petMonthMap: Record<string, number> = {};
  for (let i = 5; i >= 0; i--) {
    const d = new Date(now.getFullYear(), now.getMonth() - i, 1);
    petMonthMap[monthLabel(d)] = 0;
  }
  for (const p of allPets) {
    const label = monthLabel(new Date(p.created_at));
    if (label in petMonthMap) petMonthMap[label]++;
  }
  const petMonthData = Object.entries(petMonthMap).map(([month, Pets]) => ({ month, Pets }));

  // ── Fotos por mês (6 meses) ───────────────────────────────────────────────
  const photoMonthMap: Record<string, number> = {};
  for (let i = 5; i >= 0; i--) {
    const d = new Date(now.getFullYear(), now.getMonth() - i, 1);
    photoMonthMap[monthLabel(d)] = 0;
  }
  for (const ph of allPhotos) {
    const label = monthLabel(new Date(ph.created_at));
    if (label in photoMonthMap) photoMonthMap[label]++;
  }
  const photoMonthData = Object.entries(photoMonthMap).map(([month, Fotos]) => ({ month, Fotos }));

  // ── Espécies ──────────────────────────────────────────────────────────────
  const speciesMap: Record<string, number> = {};
  for (const p of allPets) {
    const s = p.species ?? "Outros";
    speciesMap[s] = (speciesMap[s] ?? 0) + 1;
  }
  const speciesData = Object.entries(speciesMap)
    .map(([name, value]) => ({ name, value }))
    .sort((a, b) => b.value - a.value);

  // ── Castração por espécie ─────────────────────────────────────────────────
  const castrationBySpecies: Record<string, { total: number; castrated: number }> = {};
  for (const p of allPets) {
    const s = p.species ?? "Outros";
    if (!castrationBySpecies[s]) castrationBySpecies[s] = { total: 0, castrated: 0 };
    castrationBySpecies[s].total++;
    if (p.castrated) castrationBySpecies[s].castrated++;
  }
  const castrationData = Object.entries(castrationBySpecies)
    .map(([species, { total, castrated }]) => ({
      species,
      total,
      castrated,
      pct: total > 0 ? Math.round((castrated / total) * 100) : 0,
    }))
    .sort((a, b) => b.total - a.total)
    .slice(0, 5);

  // ── Gênero dos pets ───────────────────────────────────────────────────────
  const genderMap: Record<string, number> = { Macho: 0, Fêmea: 0, "Não informado": 0 };
  for (const p of allPets) {
    const g = (p.gender ?? "").toLowerCase();
    if (g === "macho" || g === "male") genderMap["Macho"]++;
    else if (g === "fêmea" || g === "femea" || g === "female") genderMap["Fêmea"]++;
    else genderMap["Não informado"]++;
  }
  const genderData = Object.entries(genderMap)
    .filter(([, v]) => v > 0)
    .map(([name, value]) => ({ name, value }));

  // ── Castrados (total) ─────────────────────────────────────────────────────
  const castrated = allPets.filter((p) => p.castrated).length;
  const notCastrated = allPets.length - castrated;

  // ── Localização ───────────────────────────────────────────────────────────
  const locationMap: Record<string, number> = {};
  for (const p of allProfiles) {
    const loc = p.state ?? p.city ?? "Não informado";
    locationMap[loc] = (locationMap[loc] ?? 0) + 1;
  }
  const locationData = Object.entries(locationMap)
    .map(([name, value]) => ({ name, value }))
    .sort((a, b) => b.value - a.value)
    .slice(0, 8);

  // ── Distribuição de plataforma ────────────────────────────────────────────
  const platformMap: Record<string, number> = { Android: 0, iOS: 0, "Não informado": 0 };
  for (const p of allProfiles) {
    if (p.platform === "android") platformMap["Android"]++;
    else if (p.platform === "ios") platformMap["iOS"]++;
    else platformMap["Não informado"]++;
  }
  const platformData = Object.entries(platformMap)
    .filter(([, v]) => v > 0)
    .map(([name, value]) => ({ name, value }));

  // ── Conversão (usuários com pelo menos 1 pet) ─────────────────────────────
  const usersWithPets = new Set(allPets.map((p) => p.user_id)).size;
  const totalUsers = authUsers.length;
  const conversionRate = totalUsers > 0 ? Math.round((usersWithPets / totalUsers) * 100) : 0;

  // ── Média de pets por usuário ativo ───────────────────────────────────────
  const avgPetsPerUser = usersWithPets > 0
    ? Math.round((allPets.length / usersWithPets) * 10) / 10
    : 0;

  // ── Taxa de foto por pet ──────────────────────────────────────────────────
  const petsWithPhoto = new Set(allPhotos.map((ph) => ph.pet_id)).size;
  const photoRate = allPets.length > 0
    ? Math.round((petsWithPhoto / allPets.length) * 100)
    : 0;
  const totalPhotos = allPhotos.length;

  // ── Completude de perfil ──────────────────────────────────────────────────
  const profileComplete = allProfiles.filter(
    (p) => p.city && p.state && p.birth_date && p.experience
  ).length;
  const profileCompletenessRate = allProfiles.length > 0
    ? Math.round((profileComplete / allProfiles.length) * 100)
    : 0;

  // ── Saúde dos pets ────────────────────────────────────────────────────────
  const withMicrochip = allPets.filter((p) => p.microchip && p.microchip.trim() !== "").length;
  const withAllergies = allPets.filter(
    (p) => (p.food_allergies && p.food_allergies.trim() !== "") ||
            (p.med_allergies && p.med_allergies.trim() !== "") ||
            (p.restrictions && p.restrictions.trim() !== "")
  ).length;
  const microchipRate = allPets.length > 0 ? Math.round((withMicrochip / allPets.length) * 100) : 0;
  const allergyRate = allPets.length > 0 ? Math.round((withAllergies / allPets.length) * 100) : 0;

  // ── Idade média dos pets ──────────────────────────────────────────────────
  const nowMs = now.getTime();
  const petAges = allPets
    .map((p) => parseDob(p.dob))
    .filter((d): d is Date => d !== null)
    .map((d) => (nowMs - d.getTime()) / (1000 * 60 * 60 * 24 * 365.25));

  const avgPetAgeYears = petAges.length > 0
    ? Math.round((petAges.reduce((a, b) => a + b, 0) / petAges.length) * 10) / 10
    : null;

  // Faixas etárias dos pets
  const ageBands = { "Filhote (< 1a)": 0, "Jovem (1–3a)": 0, "Adulto (3–8a)": 0, "Sênior (> 8a)": 0 };
  for (const age of petAges) {
    if (age < 1) ageBands["Filhote (< 1a)"]++;
    else if (age < 3) ageBands["Jovem (1–3a)"]++;
    else if (age < 8) ageBands["Adulto (3–8a)"]++;
    else ageBands["Sênior (> 8a)"]++;
  }
  const ageBandData = Object.entries(ageBands)
    .map(([name, value]) => ({ name, value }))
    .filter((b) => b.value > 0);

  // ── Experiência dos usuários ──────────────────────────────────────────────
  const experienceMap: Record<string, number> = {};
  for (const p of allProfiles) {
    const exp = p.experience ?? "Não informado";
    experienceMap[exp] = (experienceMap[exp] ?? 0) + 1;
  }
  const experienceData = Object.entries(experienceMap)
    .map(([name, value]) => ({ name, value }))
    .sort((a, b) => b.value - a.value);

  return {
    // KPIs principais
    totalUsers,
    totalPets: allPets.length,
    usersWithPets,
    conversionRate,
    newThisMonth,
    momGrowth,
    avgPetsPerUser,
    // Castração
    castrated,
    notCastrated,
    castrationData,
    // Gráficos de crescimento
    userGrowthData,
    petMonthData,
    photoMonthData,
    // Composição
    speciesData,
    genderData,
    ageBandData,
    avgPetAgeYears,
    // Saúde
    totalPhotos,
    photoRate,
    microchipRate,
    allergyRate,
    // Perfil
    profileCompletenessRate,
    experienceData,
    // Localização
    locationData,
    // Plataforma
    platformData,
  };
}

export default async function AnalyticsPage() {
  const data = await getAnalytics();
  return <AnalyticsClient data={data} />;
}
