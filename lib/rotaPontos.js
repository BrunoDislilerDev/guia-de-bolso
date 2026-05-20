/**
 * Normaliza detalhes ordenados de um ponto (DB ou formulário).
 * @param {Array<{ texto?: string, ordem?: number }>} [detalhes]
 * @returns {Array<{ texto: string, ordem: number }>}
 */
export function sortPontoDetalhes(detalhes) {
  return [...(detalhes ?? [])]
    .map((item, index) => ({
      texto: String(item?.texto ?? "").trim(),
      ordem: item?.ordem || index + 1,
    }))
    .filter((item) => item.texto)
    .sort((a, b) => a.ordem - b.ordem)
    .map((item, index) => ({ ...item, ordem: index + 1 }));
}

/**
 * Monta estado do formulário a partir de `rota_pontos` + join.
 * @param {object} ponto
 * @param {number} index
 * @returns {{ nome: string, ordem: number, detalhes: Array<{ texto: string, ordem: number }> }}
 */
export function mapPontoFromDb(ponto, index) {
  const fromJoin = sortPontoDetalhes(ponto?.rota_ponto_detalhes);
  const detalhes =
    fromJoin.length > 0
      ? fromJoin
      : ponto?.descricao?.trim()
        ? [{ texto: ponto.descricao.trim(), ordem: 1 }]
        : [];

  return {
    nome: ponto?.nome || ponto?.titulo || "",
    ordem: ponto?.ordem || index + 1,
    detalhes,
  };
}

/**
 * Detalhes para exibição no app (join ou legado `descricao`).
 * @param {object} ponto
 * @returns {Array<{ id?: string, texto: string, ordem: number }>}
 */
export function getDetalhesFromPonto(ponto) {
  const rows = [...(ponto?.rota_ponto_detalhes ?? [])].sort(
    (a, b) => (a.ordem || 0) - (b.ordem || 0)
  );

  if (rows.length > 0) {
    return rows
      .filter((row) => row.texto?.trim())
      .map((row, index) => ({
        id: row.id,
        texto: row.texto.trim(),
        ordem: row.ordem || index + 1,
      }));
  }

  if (ponto?.descricao?.trim()) {
    return [{ id: `legacy-${ponto.id}`, texto: ponto.descricao.trim(), ordem: 1 }];
  }

  return [];
}
