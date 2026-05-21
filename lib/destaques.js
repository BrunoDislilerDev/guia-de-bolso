import {
  PLANO_COMERCIAL_NOME,
  PLANO_COMERCIAL_PRECO,
} from "@/lib/planoComercial";

/** @typedef {import("@supabase/supabase-js").SupabaseClient} SupabaseClient */

/**
 * Data local em ISO (YYYY-MM-DD) para comparar vigência.
 * @param {Date} [date]
 * @returns {string}
 */
export function hojeISO(date = new Date()) {
  const y = date.getFullYear();
  const m = String(date.getMonth() + 1).padStart(2, "0");
  const d = String(date.getDate()).padStart(2, "0");
  return `${y}-${m}-${d}`;
}

/**
 * Lugar embutido no destaque (join Supabase).
 * @param {object} destaque
 * @returns {object|null}
 */
function getLugarFromDestaque(destaque) {
  return destaque?.lugares ?? destaque?.lugar ?? null;
}

/**
 * Destaque comercial vigente: ativo, dentro do período e lugar publicado.
 * @param {object} destaque - Linha de `destaques` (opcional join `lugares`).
 * @param {string} [hoje] - YYYY-MM-DD.
 * @returns {boolean}
 */
export function isDestaqueVigente(destaque, hoje = hojeISO()) {
  if (!destaque?.ativo) return false;

  const lugar = getLugarFromDestaque(destaque);
  if (lugar?.status && lugar.status !== "ativo") return false;

  const inicio = destaque.data_inicio;
  const fim = destaque.data_fim;
  if (inicio && hoje < inicio) return false;
  if (fim && hoje > fim) return false;

  return true;
}

/**
 * Status operacional do destaque (admin e listagens).
 * @param {object} destaque
 * @param {string} [hoje]
 * @returns {"vigente"|"agendado"|"expirado"|"inativo"}
 */
export function getDestaqueStatus(destaque, hoje = hojeISO()) {
  if (!destaque?.ativo) return "inativo";
  if (destaque.data_inicio && hoje < destaque.data_inicio) return "agendado";
  if (destaque.data_fim && hoje > destaque.data_fim) return "expirado";
  const lugar = getLugarFromDestaque(destaque);
  if (lugar?.status && lugar.status !== "ativo") return "inativo";
  return "vigente";
}

/**
 * @param {SupabaseClient} supabase
 * @param {string} [hoje]
 * @returns {Promise<object[]>}
 */
export async function fetchDestaquesVigentes(supabase, hoje = hojeISO()) {
  const { data, error } = await supabase
    .from("destaques")
    .select("*, lugares!inner(*), planos(nome, frequencia, preco)")
    .eq("ativo", true)
    .eq("lugares.status", "ativo")
    .lte("data_inicio", hoje)
    .gte("data_fim", hoje)
    .order("data_inicio", { ascending: false });

  if (error) {
    console.error("[fetchDestaquesVigentes]", error.message);
    return [];
  }

  return (data ?? []).filter((row) => isDestaqueVigente(row, hoje));
}

/**
 * Todos os destaques (admin) com join de lugar e plano.
 * @param {SupabaseClient} supabase
 * @returns {Promise<object[]>}
 */
export async function fetchDestaquesAdmin(supabase) {
  const { data, error } = await supabase
    .from("destaques")
    .select("*, lugares(nome, status), planos(nome, frequencia, preco)")
    .order("data_inicio", { ascending: false });

  if (error) {
    console.error("[fetchDestaquesAdmin]", error.message);
    return [];
  }

  return data ?? [];
}

/**
 * @param {object[]} destaques
 * @param {string} [hoje]
 * @returns {Set<string>}
 */
export function buildParceiroIdSet(destaques, hoje = hojeISO()) {
  const ids = new Set();
  for (const destaque of destaques) {
    if (!isDestaqueVigente(destaque, hoje)) continue;
    const lugar = getLugarFromDestaque(destaque);
    if (lugar?.id) ids.add(String(lugar.id));
    else if (destaque.lugar_id) ids.add(String(destaque.lugar_id));
  }
  return ids;
}

/**
 * @param {string} lugarId
 * @param {Set<string>|string[]} parceiroIds
 * @returns {boolean}
 */
export function isLugarParceiroVigente(lugarId, parceiroIds) {
  if (!lugarId || !parceiroIds) return false;
  const set = parceiroIds instanceof Set ? parceiroIds : new Set(parceiroIds);
  return set.has(String(lugarId));
}

/**
 * @param {object} lugar
 * @param {Set<string>|string[]} parceiroIds
 * @returns {object}
 */
export function enrichLugarComParceiro(lugar, parceiroIds) {
  if (!lugar) return lugar;
  return {
    ...lugar,
    ehParceiro: isLugarParceiroVigente(lugar.id, parceiroIds),
  };
}

/**
 * @param {object[]} lugares
 * @param {Set<string>|string[]} parceiroIds
 * @returns {object[]}
 */
export function enrichLugaresComParceiro(lugares, parceiroIds) {
  return (lugares ?? []).map((l) => enrichLugarComParceiro(l, parceiroIds));
}

/**
 * Monta lista de lugares parceiros a partir de destaques vigentes (preserva ordem do carrossel).
 * @param {object[]} destaquesVigentes
 * @param {object[]} [lugaresIndex] - Opcional: lugares já carregados para merge.
 * @returns {object[]}
 */
export function lugaresFromDestaquesVigentes(destaquesVigentes, lugaresIndex = []) {
  const byId = new Map(lugaresIndex.map((l) => [String(l.id), l]));
  const out = [];

  for (const destaque of destaquesVigentes) {
    const lugar = getLugarFromDestaque(destaque);
    if (!lugar?.id) continue;
    const merged = byId.get(String(lugar.id)) ?? lugar;
    out.push(enrichLugarComParceiro(merged, new Set([String(lugar.id)])));
  }

  return out;
}

/**
 * Verifica se um lugar tem destaque vigente (detalhe / server).
 * @param {SupabaseClient} supabase
 * @param {string} lugarId
 * @param {string} [hoje]
 * @returns {Promise<boolean>}
 */
export async function fetchLugarEhParceiroVigente(supabase, lugarId, hoje = hojeISO()) {
  const { data, error } = await supabase
    .from("destaques")
    .select("id, ativo, data_inicio, data_fim, lugares!inner(status)")
    .eq("lugar_id", lugarId)
    .eq("ativo", true)
    .eq("lugares.status", "ativo")
    .lte("data_inicio", hoje)
    .gte("data_fim", hoje)
    .limit(1)
    .maybeSingle();

  if (error || !data) return false;
  return isDestaqueVigente(data, hoje);
}

/**
 * Rótulo do badge de parceiro no app.
 * @returns {string}
 */
export function getBadgeParceiroLabel() {
  return "Parceiro do guia";
}

/**
 * Nome do plano exibido no admin (fallback V1).
 * @param {object} [plano]
 * @returns {string}
 */
export function getPlanoComercialLabel(_plano) {
  const valor = PLANO_COMERCIAL_PRECO.toFixed(2).replace(".", ",");
  return `${PLANO_COMERCIAL_NOME} · R$ ${valor}/mês`;
}
