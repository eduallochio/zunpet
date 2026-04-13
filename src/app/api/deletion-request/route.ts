import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

export async function POST(req: NextRequest) {
  try {
    const { email, reason } = await req.json();

    if (!email || typeof email !== "string") {
      return NextResponse.json({ error: "Email obrigatório" }, { status: 400 });
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return NextResponse.json({ error: "Email inválido" }, { status: 400 });
    }

    // Verifica se já existe solicitação pendente para este email
    const { data: existing } = await supabase
      .from("deletion_requests")
      .select("id, status")
      .eq("email", email.toLowerCase().trim())
      .in("status", ["pending", "processing"])
      .maybeSingle();

    if (existing) {
      return NextResponse.json(
        { error: "Já existe uma solicitação em andamento para este email." },
        { status: 409 }
      );
    }

    const { error } = await supabase.from("deletion_requests").insert({
      email: email.toLowerCase().trim(),
      reason: reason?.trim() || null,
      source: "web",
    });

    if (error) throw error;

    return NextResponse.json({ ok: true });
  } catch {
    return NextResponse.json({ error: "Erro interno. Tente novamente." }, { status: 500 });
  }
}
