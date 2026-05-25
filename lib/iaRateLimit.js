import { getRequestClientIp } from "@/lib/requestClientIp";

/** Janela e limites para rotas de IA (por usuário ou IP). */
const WINDOW_MS = 60 * 60 * 1000;
const MAX_PER_USER = 40;
const MAX_PER_IP = 15;

/** @type {Map<string, number[]>} */
const buckets = new Map();

/**
 * Rate limit em memória (serverless: melhor que nada; use Upstash/KV em escala).
 * @param {import('next/server').NextRequest} request
 * @param {string|null|undefined} userId
 * @returns {{ allowed: boolean, retryAfterSec?: number }}
 */
export function checkIaRateLimit(request, userId) {
  const now = Date.now();
  const ip = getRequestClientIp(request);
  const key = userId ? `user:${userId}` : `ip:${ip}`;
  const max = userId ? MAX_PER_USER : MAX_PER_IP;
  const hits = (buckets.get(key) ?? []).filter((t) => now - t < WINDOW_MS);

  if (hits.length >= max) {
    const oldest = hits[0] ?? now;
    const retryAfterSec = Math.ceil((WINDOW_MS - (now - oldest)) / 1000);
    buckets.set(key, hits);
    return { allowed: false, retryAfterSec };
  }

  hits.push(now);
  buckets.set(key, hits);
  return { allowed: true };
}
