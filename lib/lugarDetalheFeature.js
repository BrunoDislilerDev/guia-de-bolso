/**
 * Feature flag do redesign do detalhe do lugar (estilo Airbnb).
 * - `NEXT_PUBLIC_LUGAR_DETALHE_V2=true` → novo layout
 * - `NEXT_PUBLIC_LUGAR_DETALHE_V2=false` → legado explícito
 * - Em `development`, padrão é V2 na branch de redesign
 * @returns {boolean}
 */
export function useLugarDetalheV2() {
  const flag = process.env.NEXT_PUBLIC_LUGAR_DETALHE_V2;
  if (flag === "true") return true;
  if (flag === "false") return false;
  return process.env.NODE_ENV === "development";
}
