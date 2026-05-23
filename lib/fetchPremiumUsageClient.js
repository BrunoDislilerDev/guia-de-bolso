import { createDefaultUsage, normalizeUsageFromPerfil } from "@/lib/premium";
import { createClient } from "@/lib/supabase/client";

const PERFIL_USAGE_SELECT =
  "id, premium_ativo, premium_ate, uso_ia_mes, buscas_ia, roteiros_ia";

/**
 * Lê contadores de uso IA do perfil via cliente browser (RLS `perfis_select_own`).
 * Fallback quando `/api/uso-premium` não enxerga a sessão nos cookies.
 * @param {string} userId
 * @returns {Promise<import('@/lib/premium').PremiumUsage>}
 */
export async function fetchPremiumUsageFromPerfil(userId) {
  if (!userId) return createDefaultUsage();

  const supabase = createClient();
  const { data, error } = await supabase
    .from("perfis")
    .select(PERFIL_USAGE_SELECT)
    .eq("id", userId)
    .maybeSingle();

  if (error) {
    console.warn("[fetchPremiumUsageFromPerfil]", error.message);
    return createDefaultUsage();
  }

  return normalizeUsageFromPerfil(data ?? {});
}
