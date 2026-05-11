import { supabaseAdmin } from "@/lib/supabase-admin";
import GeoClient from "./GeoClient";

export const revalidate = 300;

async function getGeoData() {
  const { data: profiles } = await supabaseAdmin
    .from("user_profiles")
    .select("city, state, country");

  const cityCount:    Record<string, number> = {};
  const stateCount:   Record<string, number> = {};
  const countryCount: Record<string, number> = {};

  for (const p of profiles ?? []) {
    if (p.city)    cityCount[p.city]       = (cityCount[p.city] ?? 0) + 1;
    if (p.state)   stateCount[p.state]     = (stateCount[p.state] ?? 0) + 1;
    if (p.country) countryCount[p.country] = (countryCount[p.country] ?? 0) + 1;
  }

  const topCities = Object.entries(cityCount)
    .map(([name, count]) => ({ name, count }))
    .sort((a, b) => b.count - a.count)
    .slice(0, 10);

  const topStates = Object.entries(stateCount)
    .map(([name, count]) => ({ name, count }))
    .sort((a, b) => b.count - a.count)
    .slice(0, 10);

  const topCountries = Object.entries(countryCount)
    .map(([name, count]) => ({ name, count }))
    .sort((a, b) => b.count - a.count)
    .slice(0, 8);

  const withLocation = (profiles ?? []).filter(p => p.city || p.state).length;
  const total = profiles?.length ?? 0;

  return { topCities, topStates, topCountries, withLocation, total };
}

export default async function GeoPage() {
  const data = await getGeoData();
  return <GeoClient data={data} />;
}
