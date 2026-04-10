import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

function getDevice(ua: string): "mobile" | "tablet" | "desktop" {
  if (/tablet|ipad/i.test(ua)) return "tablet";
  if (/mobile|android|iphone/i.test(ua)) return "mobile";
  return "desktop";
}

export async function POST(req: NextRequest) {
  try {
    const { store } = await req.json();
    if (!["android", "ios"].includes(store)) {
      return NextResponse.json({ error: "invalid store" }, { status: 400 });
    }

    const ua = req.headers.get("user-agent") ?? "";
    const device = getDevice(ua);
    const country = req.headers.get("x-vercel-ip-country") ?? null;

    await supabase.from("store_clicks").insert({ store, device, country });
    return NextResponse.json({ ok: true });
  } catch {
    return NextResponse.json({ error: "failed" }, { status: 500 });
  }
}
