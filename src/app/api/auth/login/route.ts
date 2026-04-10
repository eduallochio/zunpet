import { NextRequest, NextResponse } from "next/server";
import { signToken, validateCredentials, COOKIE_NAME } from "@/lib/auth";
import { checkRateLimit, recordFailedAttempt, resetAttempts } from "@/lib/rate-limit";

function getClientIp(request: NextRequest): string {
  return (
    request.headers.get("x-forwarded-for")?.split(",")[0].trim() ??
    request.headers.get("x-real-ip") ??
    "unknown"
  );
}

export async function POST(request: NextRequest) {
  const ip = getClientIp(request);

  // Rate limiting
  const rateLimit = checkRateLimit(ip);
  if (!rateLimit.allowed) {
    return NextResponse.json(
      { error: `Muitas tentativas. Tente novamente em ${Math.ceil(rateLimit.retryAfterSeconds / 60)} min.` },
      {
        status: 429,
        headers: { "Retry-After": String(rateLimit.retryAfterSeconds) },
      }
    );
  }

  let email: string;
  let password: string;

  try {
    const body = await request.json();
    email = typeof body.email === "string" ? body.email.trim().toLowerCase() : "";
    password = typeof body.password === "string" ? body.password : "";
  } catch {
    return NextResponse.json({ error: "Requisição inválida" }, { status: 400 });
  }

  if (!email || !password) {
    return NextResponse.json(
      { error: "E-mail e senha são obrigatórios" },
      { status: 400 }
    );
  }

  let valid: boolean;
  try {
    valid = validateCredentials(email, password);
  } catch (err) {
    console.error("[login]", err);
    return NextResponse.json({ error: "Erro interno do servidor" }, { status: 500 });
  }

  if (!valid) {
    recordFailedAttempt(ip);
    // Delay fixo para dificultar timing attacks
    await new Promise((r) => setTimeout(r, 500));
    return NextResponse.json({ error: "Credenciais inválidas" }, { status: 401 });
  }

  // Login bem-sucedido — limpar tentativas
  resetAttempts(ip);

  let token: string;
  try {
    token = await signToken({ email });
  } catch (err) {
    console.error("[login] signToken falhou:", err);
    return NextResponse.json({ error: "Erro interno do servidor" }, { status: 500 });
  }

  const response = NextResponse.json({ ok: true });
  response.cookies.set(COOKIE_NAME, token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "strict",
    path: "/",
    maxAge: 60 * 60 * 8, // 8 horas
  });

  return response;
}
