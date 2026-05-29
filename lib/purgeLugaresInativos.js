import { deleteLugar } from "@/lib/deleteLugar";
import { hojeISO } from "@/lib/homeRotation";
import {
  getDiasRestantesExclusao,
  getExclusaoPrevistaISO,
  isElegivelPurgeImediato,
  LUGAR_PURGE_DIAS,
} from "@/lib/lugarPurge";

/**
 * @param {import('@supabase/supabase-js').SupabaseClient} admin
 * @param {string} [hoje] YYYY-MM-DD
 * @returns {Promise<Array<{ id: number|string, nome: string, desativado_em: string }>>}
 */
export async function fetchLugaresElegiveisPurge(admin, hoje = hojeISO()) {
  const { data, error } = await admin
    .from("lugares")
    .select("id, nome, desativado_em")
    .eq("status", "desativado")
    .not("desativado_em", "is", null);

  if (error) {
    throw new Error(`Falha ao listar lugares para purge: ${error.message}`);
  }

  return (data ?? []).filter((row) =>
    isElegivelPurgeImediato(row.desativado_em, hoje)
  );
}

/**
 * @param {import('@supabase/supabase-js').SupabaseClient} admin
 * @param {{ hoje?: string, dryRun?: boolean }} [options]
 * @returns {Promise<{
 *   hoje: string,
 *   dryRun: boolean,
 *   candidatos: number,
 *   excluidos: number,
 *   erros: Array<{ id: number|string, nome: string, message: string }>,
 *   idsExcluidos: Array<number|string>,
 * }>}
 */
export async function purgeLugaresInativos(admin, { hoje = hojeISO(), dryRun = false } = {}) {
  const candidatos = await fetchLugaresElegiveisPurge(admin, hoje);
  /** @type {Array<number|string>} */
  const idsExcluidos = [];
  /** @type {Array<{ id: number|string, nome: string, message: string }>} */
  const erros = [];

  if (!dryRun) {
    for (const lugar of candidatos) {
      try {
        await deleteLugar(admin, lugar.id);
        idsExcluidos.push(lugar.id);

        const { error: logError } = await admin.from("logs").insert({
          user_id: null,
          user_email: null,
          user_nome: "Sistema",
          acao: "excluiu_lugar_inativo",
          detalhes: {
            lugar_id: lugar.id,
            nome: lugar.nome,
            desativado_em: lugar.desativado_em,
            exclusao_prevista: getExclusaoPrevistaISO(lugar.desativado_em, hoje),
            dias_inativo: LUGAR_PURGE_DIAS,
          },
        });

        if (logError) {
          console.warn("[purgeLugaresInativos] log:", logError.message);
        }
      } catch (err) {
        erros.push({
          id: lugar.id,
          nome: lugar.nome,
          message: err instanceof Error ? err.message : String(err),
        });
      }
    }
  }

  return {
    hoje,
    dryRun,
    candidatos: candidatos.length,
    excluidos: idsExcluidos.length,
    erros,
    idsExcluidos,
  };
}

export { getDiasRestantesExclusao, getExclusaoPrevistaISO };
