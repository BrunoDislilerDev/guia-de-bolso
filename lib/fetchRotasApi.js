/**
 * Busca rotas curadas via API (servidor usa anon key).
 * @param {object} [options]
 * @param {number} [options.limit]
 * @returns {Promise<object[]>}
 */
export async function fetchRotasFromApi(options = {}) {
  const params = new URLSearchParams();
  const { limit } = options;
  if (limit) params.set("limit", String(limit));

  const res = await fetch(`/api/rotas?${params.toString()}`, {
    credentials: "same-origin",
    cache: "no-store",
  });

  const body = await res.json().catch(() => ({}));
  if (!res.ok) {
    throw new Error(body.error || "Não foi possível carregar as rotas.");
  }

  return body.rotas ?? [];
}
