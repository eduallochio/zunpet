import { NextRequest, NextResponse } from "next/server";
import { verifyToken, COOKIE_NAME } from "@/lib/auth";

export async function POST(request: NextRequest) {
  // Verificar token antes de aceitar o logout (evita logout forçado por terceiros)
  const token = request.cookies.get(COOKIE_NAME)?.value;
  const response = NextResponse.json({ ok: true });

  if (token) {
    const payload = await verifyToken(token);
    if (payload) {
      response.cookies.delete(COOKIE_NAME);
    }
  }

  // Sempre redireciona para login (mesmo sem token válido)
  response.cookies.delete(COOKIE_NAME);
  return response;
}
