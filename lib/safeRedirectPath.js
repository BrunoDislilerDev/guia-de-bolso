/**
 * Valida path de redirect pós-OAuth (evita open redirect).
 * @param {string|null|undefined} next
 * @param {string} [fallback='/']
 * @returns {string}
 */
export function safeRedirectPath(next, fallback = "/") {
  if (!next || typeof next !== "string") return fallback;
  const trimmed = next.trim();
  if (!trimmed.startsWith("/") || trimmed.startsWith("//")) return fallback;
  if (trimmed.includes("://")) return fallback;
  return trimmed;
}
