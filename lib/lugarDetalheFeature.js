/**
 * Feature flag do redesign do detalhe do lugar (estilo Airbnb).
 * - Padrão: novo layout (V2) em todos os ambientes
 * - `NEXT_PUBLIC_LUGAR_DETALHE_V2=false` → layout legado (rollback)
 * @returns {boolean}
 */
export function useLugarDetalheV2() {
  return process.env.NEXT_PUBLIC_LUGAR_DETALHE_V2 !== "false";
}
