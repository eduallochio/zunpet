// Rate limiter em memória — adequado para dashboard single-user/single-instance
// Para multi-instância em produção, substituir por Redis

type Entry = {
  count: number;
  firstAttempt: number;
  blockedUntil?: number;
};

const store = new Map<string, Entry>();

const MAX_ATTEMPTS = 5;
const WINDOW_MS = 15 * 60 * 1000;   // 15 minutos
const BLOCK_MS  = 30 * 60 * 1000;   // 30 minutos bloqueado após exceder

// Limpeza periódica para não acumular memória
setInterval(() => {
  const now = Date.now();
  for (const [key, entry] of store.entries()) {
    const expired = entry.blockedUntil
      ? now > entry.blockedUntil
      : now - entry.firstAttempt > WINDOW_MS;
    if (expired) store.delete(key);
  }
}, 5 * 60 * 1000);

export type RateLimitResult =
  | { allowed: true }
  | { allowed: false; retryAfterSeconds: number };

export function checkRateLimit(ip: string): RateLimitResult {
  const now = Date.now();
  const entry = store.get(ip);

  // Bloqueado temporariamente
  if (entry?.blockedUntil) {
    if (now < entry.blockedUntil) {
      return {
        allowed: false,
        retryAfterSeconds: Math.ceil((entry.blockedUntil - now) / 1000),
      };
    }
    // Bloqueio expirou — resetar
    store.delete(ip);
  }

  // Janela expirada — resetar contador
  if (entry && now - entry.firstAttempt > WINDOW_MS) {
    store.delete(ip);
  }

  const current = store.get(ip) ?? { count: 0, firstAttempt: now };

  if (current.count >= MAX_ATTEMPTS) {
    current.blockedUntil = now + BLOCK_MS;
    store.set(ip, current);
    return {
      allowed: false,
      retryAfterSeconds: Math.ceil(BLOCK_MS / 1000),
    };
  }

  return { allowed: true };
}

export function recordFailedAttempt(ip: string): void {
  const now = Date.now();
  const entry = store.get(ip) ?? { count: 0, firstAttempt: now };
  entry.count += 1;

  if (entry.count >= MAX_ATTEMPTS) {
    entry.blockedUntil = now + BLOCK_MS;
  }

  store.set(ip, entry);
}

export function resetAttempts(ip: string): void {
  store.delete(ip);
}
