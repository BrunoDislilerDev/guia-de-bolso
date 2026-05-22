/** Opções exibidas no formulário de roteiro com IA. */
export const ROTEIRO_DIAS_OPCOES = ["1 dia", "2 dias", "3 dias", "4+ dias"];

/**
 * Converte rótulo da UI ou número em inteiro para `roteiros.dias`.
 * @param {string|number|null|undefined} value - Ex.: `"2 dias"`, `2`.
 * @returns {number|null} 1–4 ou `null` se inválido.
 */
export function parseDiasViagem(value) {
  if (typeof value === "number" && Number.isFinite(value)) {
    const n = Math.trunc(value);
    return n >= 1 && n <= 99 ? n : null;
  }

  const texto = String(value ?? "")
    .trim()
    .toLowerCase();

  if (!texto) return null;

  if (texto.includes("4+") || /^4\+?\s*dias?$/.test(texto)) {
    return 4;
  }

  const match = texto.match(/(\d+)/);
  if (!match) return null;

  const n = parseInt(match[1], 10);
  return n >= 1 && n <= 99 ? n : null;
}

/**
 * Formata valor persistido (`integer` ou legado `text`) para exibição.
 * @param {string|number|null|undefined} value
 * @returns {string}
 */
export function formatDiasViagem(value) {
  const n = parseDiasViagem(value);
  if (n === null) {
    const legado = String(value ?? "").trim();
    return legado;
  }
  if (n >= 4) return "4+ dias";
  if (n === 1) return "1 dia";
  return `${n} dias`;
}
