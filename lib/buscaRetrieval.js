/**
 * Reduz catálogo enviado ao Claude: score por palavras da query.
 * @param {object[]} lugares - Resumos de busca (id, nome, categoria, tags, …).
 * @param {string} query
 * @param {number} [max=60]
 * @returns {object[]}
 */
export function rankLugaresForBusca(lugares, query, max = 60) {
  const q = query
    .toLowerCase()
    .normalize("NFD")
    .replace(/\p{M}/gu, "")
    .trim();

  if (!q || !lugares?.length) {
    return (lugares ?? []).slice(0, max);
  }

  const tokens = q.split(/\s+/).filter((t) => t.length > 2);

  const scored = lugares.map((lugar) => {
    const hay = [
      lugar.nome,
      lugar.categoria,
      lugar.subcategoria,
      lugar.descricao,
      ...(lugar.tags ?? []).map((t) => (typeof t === "string" ? t : t?.nome)),
    ]
      .filter(Boolean)
      .join(" ")
      .toLowerCase()
      .normalize("NFD")
      .replace(/\p{M}/gu, "");

    let score = 0;
    for (const token of tokens) {
      if (hay.includes(token)) score += 3;
    }
    if (hay.includes(q)) score += 5;

    return { lugar, score };
  });

  return scored
    .sort((a, b) => b.score - a.score)
    .slice(0, max)
    .map((s) => s.lugar);
}
