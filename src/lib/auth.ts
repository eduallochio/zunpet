import { SignJWT, jwtVerify } from "jose";

const COOKIE_NAME = "zupet_admin_session";
const SESSION_DURATION = "8h";

// Falha explícita se JWT_SECRET não estiver definido em produção
function getJwtSecret(): Uint8Array {
  const secret = process.env.JWT_SECRET;
  if (!secret || secret.length < 32) {
    throw new Error(
      "[auth] JWT_SECRET não configurado ou muito curto (mínimo 32 chars). Configure no .env.local"
    );
  }
  return new TextEncoder().encode(secret);
}

export { COOKIE_NAME };

export async function signToken(payload: { email: string }): Promise<string> {
  return new SignJWT(payload)
    .setProtectedHeader({ alg: "HS256" })
    .setIssuedAt()
    .setExpirationTime(SESSION_DURATION)
    .sign(getJwtSecret());
}

export async function verifyToken(token: string): Promise<{ email: string } | null> {
  try {
    const { payload } = await jwtVerify(token, getJwtSecret());
    if (!payload.email || typeof payload.email !== "string") return null;
    return { email: payload.email as string };
  } catch {
    return null;
  }
}

export function validateCredentials(email: string, password: string): boolean {
  const adminEmail = process.env.ADMIN_EMAIL;
  const adminPassword = process.env.ADMIN_PASSWORD;

  if (!adminEmail || !adminPassword) {
    throw new Error(
      "[auth] ADMIN_EMAIL ou ADMIN_PASSWORD não configurados no .env.local"
    );
  }

  // Comparação de tempo constante para evitar timing attacks
  const emailMatch = timingSafeEqual(email, adminEmail);
  const passwordMatch = timingSafeEqual(password, adminPassword);
  return emailMatch && passwordMatch;
}

// Comparação de strings em tempo constante (evita timing attacks)
function timingSafeEqual(a: string, b: string): boolean {
  const bufA = new TextEncoder().encode(a.padEnd(256));
  const bufB = new TextEncoder().encode(b.padEnd(256));
  let diff = 0;
  for (let i = 0; i < bufA.length; i++) {
    diff |= bufA[i] ^ bufB[i];
  }
  return diff === 0 && a.length === b.length;
}
