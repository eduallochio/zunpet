import { supabaseAdmin } from "@/lib/supabase-admin";
import { LandingAnalyticsClient } from "./LandingAnalyticsClient";

function buildRange(searchParams: Record<string, string | undefined>) {
  const preset = searchParams.preset ?? "30d";
  const from = searchParams.from;
  const to = searchParams.to;

  if (from && to) {
    return { from: new Date(from).toISOString(), to: new Date(to + "T23:59:59").toISOString(), preset: "custom" };
  }

  const now = new Date();
  const days = preset === "7d" ? 7 : preset === "90d" ? 90 : preset === "all" ? 3650 : 30;
  return {
    from: new Date(now.getTime() - days * 24 * 60 * 60 * 1000).toISOString(),
    to: now.toISOString(),
    preset,
  };
}

async function getData(from: string, to: string) {
  const [
    { data: views },
    { data: clicks },
    { count: totalViews },
    { count: totalClicks },
  ] = await Promise.all([
    supabaseAdmin.from("page_views").select("created_at, device, country")
      .gte("created_at", from).lte("created_at", to).order("created_at", { ascending: true }),
    supabaseAdmin.from("store_clicks").select("created_at, store, device, country")
      .gte("created_at", from).lte("created_at", to).order("created_at", { ascending: true }),
    supabaseAdmin.from("page_views").select("*", { count: "exact", head: true }),
    supabaseAdmin.from("store_clicks").select("*", { count: "exact", head: true }),
  ]);

  const viewsByDay: Record<string, number> = {};
  for (const v of views ?? []) {
    const day = v.created_at.slice(0, 10);
    viewsByDay[day] = (viewsByDay[day] ?? 0) + 1;
  }

  const clicksByDay: Record<string, { android: number; ios: number }> = {};
  for (const c of clicks ?? []) {
    const day = c.created_at.slice(0, 10);
    if (!clicksByDay[day]) clicksByDay[day] = { android: 0, ios: 0 };
    clicksByDay[day][c.store as "android" | "ios"]++;
  }

  const allDays = Array.from(
    new Set([...Object.keys(viewsByDay), ...Object.keys(clicksByDay)])
  ).sort();

  const series = allDays.map((day) => ({
    date: day,
    views: viewsByDay[day] ?? 0,
    android: clicksByDay[day]?.android ?? 0,
    ios: clicksByDay[day]?.ios ?? 0,
  }));

  const deviceViews = { mobile: 0, tablet: 0, desktop: 0 };
  for (const v of views ?? []) {
    const d = (v.device ?? "desktop") as keyof typeof deviceViews;
    deviceViews[d]++;
  }

  const androidClicks = clicks?.filter((c) => c.store === "android").length ?? 0;
  const iosClicks = clicks?.filter((c) => c.store === "ios").length ?? 0;
  const periodViews = views?.length ?? 0;
  const periodClicks = clicks?.length ?? 0;
  const ctr = periodViews > 0 ? Math.round((periodClicks / periodViews) * 1000) / 10 : 0;

  return {
    series,
    totalViews: totalViews ?? 0,
    totalClicks: totalClicks ?? 0,
    periodViews,
    periodClicks,
    androidClicks,
    iosClicks,
    ctr,
    deviceViews,
  };
}

export default async function LandingAnalyticsPage({
  searchParams,
}: {
  searchParams: Promise<Record<string, string | undefined>>;
}) {
  const params = await searchParams;
  const range = buildRange(params);
  const data = await getData(range.from, range.to);
  return <LandingAnalyticsClient data={data} preset={range.preset} fromDate={params.from} toDate={params.to} />;
}
