/**
 * Controle server-side de limites Premium e incremento de uso de IA (busca e roteiro).
 * @module lib/premiumServer
 */

import { createClient } from "@/lib/supabase/server";
import {
  LIMITS,
  enrichUsageWithDailyReset,
  getUsageDayKey,
  isPremiumActive,
  isSameUsageDay,
  normalizeUsageFromPerfil,
} from "@/lib/premium";

/** Colunas de `perfis` usadas para controle de uso de IA. */
const PERFIL_USAGE_SELECT =
  "id, premium_ativo, premium_ate, uso_ia_mes, buscas_ia, roteiros_ia";

/**
 * @typedef {Object} ServerAccessResult
 * @property {boolean} allowed
 * @property {string} [code]
 * @property {string} [message]
 * @property {import('@/lib/premium').PremiumUsage} [usage]
 * @property {number} [status] - HTTP status sugerido (401, 403).
 * @property {Object} [perfil]
 */

/**
 * Obtém cliente Supabase server-side e usuário autenticado.
 * @returns {Promise<{ supabase: import('@supabase/supabase-js').SupabaseClient, user: import('@supabase/supabase-js').User|null }>}
 */
export async function getAuthUser() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  return { supabase, user };
}

/**
 * Nome de exibição para insert de perfil.
 * @param {import('@supabase/supabase-js').User|null} user
 * @returns {string}
 */
function getDisplayName(user) {
  return (
    user?.user_metadata?.full_name ??
    user?.user_metadata?.name ??
    user?.email?.split("@")[0] ??
    "Usuário"
  );
}

/**
 * Normaliza payload JSON retornado pelas RPCs de incremento de uso.
 * @param {Object|null|undefined} usageJson
 * @returns {import('@/lib/premium').PremiumUsage}
 */
function mapRpcUsage(usageJson) {
  if (!usageJson || typeof usageJson !== "object") {
    return normalizeUsageFromPerfil({});
  }

  const day = usageJson.day ?? usageJson.month ?? getUsageDayKey();

  const usage = {
    premium: Boolean(usageJson.premium),
    day,
    month: day,
    buscas: {
      used: Number(usageJson.buscas?.used) || 0,
      limit: Number(usageJson.buscas?.limit) || LIMITS.busca,
      remaining:
        usageJson.buscas?.remaining === null || usageJson.buscas?.remaining === undefined
          ? null
          : Number(usageJson.buscas.remaining),
    },
    roteiros: {
      used: Number(usageJson.roteiros?.used) || 0,
      limit: Number(usageJson.roteiros?.limit) || LIMITS.roteiro,
      remaining:
        usageJson.roteiros?.remaining === null ||
        usageJson.roteiros?.remaining === undefined
          ? null
          : Number(usageJson.roteiros.remaining),
    },
    climaDetalhes: {
      requiresPremium: !usageJson.premium,
    },
  };

  if (usageJson.resets_at) {
    const resetsAt = new Date(usageJson.resets_at);
    return enrichUsageWithDailyReset({
      ...usage,
      resetsAt: resetsAt.toISOString(),
      msUntilReset: Math.max(0, resetsAt.getTime() - Date.now()),
    });
  }

  return enrichUsageWithDailyReset(usage);
}

/**
 * Converte resposta da RPC em resultado de acesso padronizado.
 * @param {{ allowed?: boolean, code?: string, message?: string, usage?: Object }} payload
 * @returns {ServerAccessResult}
 */
function accessFromRpcPayload(payload) {
  if (!payload?.allowed) {
    return {
      allowed: false,
      code: payload?.code ?? "LIMIT_REACHED",
      message: payload?.message ?? "Limite de uso atingido.",
      usage: mapRpcUsage(payload?.usage),
      status: payload?.code === "LOGIN_REQUIRED" ? 401 : 403,
    };
  }

  return {
    allowed: true,
    usage: mapRpcUsage(payload?.usage),
    code: payload?.code ?? "OK",
  };
}

/**
 * Tenta incrementar uso via RPC do Supabase; retorna `null` se RPC não existir.
 * @param {import('@supabase/supabase-js').SupabaseClient} supabase
 * @param {'increment_busca_ia'|'increment_roteiro_ia'} rpcName
 * @param {string} userId
 * @returns {Promise<ServerAccessResult|null>}
 */
async function incrementViaRpc(supabase, rpcName, userId) {
  const { data, error } = await supabase.rpc(rpcName, { p_user_id: userId });

  if (error) {
    const missingRpc =
      error.code === "PGRST202" ||
      error.message?.includes("Could not find the function") ||
      error.message?.includes("increment_");

    if (missingRpc) return null;
    throw error;
  }

  return accessFromRpcPayload(data);
}

/**
 * Carrega e normaliza uso de IA do perfil do usuário.
 * @param {string} userId
 * @returns {Promise<import('@/lib/premium').PremiumUsage>}
 */
export async function getPerfilUsage(userId) {
  const supabase = await createClient();

  const { data: perfil, error } = await supabase
    .from("perfis")
    .select(PERFIL_USAGE_SELECT)
    .eq("id", userId)
    .maybeSingle();

  if (error) {
    const missingColumn =
      error.code === "42703" ||
      error.message?.includes("premium_") ||
      error.message?.includes("buscas_ia") ||
      error.message?.includes("roteiros_ia") ||
      error.message?.includes("uso_ia_mes");

    if (missingColumn) {
      return normalizeUsageFromPerfil({});
    }

    throw error;
  }

  return normalizeUsageFromPerfil(perfil ?? {});
}

/**
 * Monta resposta de acesso negado com status HTTP sugerido.
 * @param {string} code
 * @param {string} message
 * @param {import('@/lib/premium').PremiumUsage} [usage]
 * @returns {ServerAccessResult}
 */
function deniedResponse(code, message, usage) {
  return {
    allowed: false,
    code,
    message,
    usage,
    status: code === "LOGIN_REQUIRED" ? 401 : 403,
  };
}

/**
 * Monta objeto de perfil otimista após incremento local.
 * @param {Object|null|undefined} perfil
 * @param {string} month
 * @param {Record<string, number>} fields
 * @returns {Object}
 */
function buildOptimisticPerfil(perfil, day, fields) {
  return {
    ...(perfil ?? {}),
    uso_ia_mes: day,
    ...fields,
  };
}

/**
 * Persiste contadores de uso em `perfis` (update ou insert).
 * @param {import('@supabase/supabase-js').SupabaseClient} supabase
 * @param {string} userId
 * @param {import('@supabase/supabase-js').User|null} user
 * @param {Object|null|undefined} perfil
 * @param {string} month
 * @param {Record<string, number|string>} fields
 * @returns {Promise<void>}
 */
async function persistUsageCounters(supabase, userId, user, perfil, day, fields) {
  const payload = {
    uso_ia_mes: day,
    ...fields,
  };

  if (perfil?.id) {
    const { error } = await supabase.from("perfis").update(payload).eq("id", userId);
    if (error) throw error;
    return;
  }

  const { error } = await supabase.from("perfis").insert({
    id: userId,
    nome: getDisplayName(user),
    ...payload,
  });

  if (error) throw error;
}

/**
 * Fallback: incrementa contador de buscas IA sem RPC.
 * @param {import('@supabase/supabase-js').SupabaseClient} supabase
 * @param {string} userId
 * @param {import('@supabase/supabase-js').User|null} user
 * @returns {Promise<ServerAccessResult>}
 */
async function incrementBuscaFallback(supabase, userId, user) {
  const day = getUsageDayKey();

  const { data: perfil, error } = await supabase
    .from("perfis")
    .select(PERFIL_USAGE_SELECT)
    .eq("id", userId)
    .maybeSingle();

  if (error) throw error;

  const usage = normalizeUsageFromPerfil(perfil ?? {});

  if (isPremiumActive(perfil)) {
    return { allowed: true, usage, perfil };
  }

  const used = isSameUsageDay(perfil?.uso_ia_mes, day)
    ? Number(perfil?.buscas_ia) || 0
    : 0;

  if (used >= LIMITS.busca) {
    return deniedResponse(
      "LIMIT_REACHED",
      `Você usou suas ${LIMITS.busca} buscas com IA de hoje. O limite reinicia à meia-noite. Assine o Premium por R$9,90/mês para uso ilimitado.`,
      enrichUsageWithDailyReset(usage)
    );
  }

  const roteirosAtual = isSameUsageDay(perfil?.uso_ia_mes, day)
    ? Number(perfil?.roteiros_ia) || 0
    : 0;

  const nextPerfil = buildOptimisticPerfil(perfil, day, {
    buscas_ia: used + 1,
    roteiros_ia: roteirosAtual,
  });

  await persistUsageCounters(supabase, userId, user, perfil, day, {
    buscas_ia: used + 1,
    roteiros_ia: roteirosAtual,
  });

  return {
    allowed: true,
    usage: normalizeUsageFromPerfil(nextPerfil),
    perfil: nextPerfil,
  };
}

/**
 * Fallback: incrementa contador de roteiros IA sem RPC.
 * @param {import('@supabase/supabase-js').SupabaseClient} supabase
 * @param {string} userId
 * @param {import('@supabase/supabase-js').User|null} user
 * @returns {Promise<ServerAccessResult>}
 */
async function incrementRoteiroFallback(supabase, userId, user) {
  const day = getUsageDayKey();

  const { data: perfil, error } = await supabase
    .from("perfis")
    .select(PERFIL_USAGE_SELECT)
    .eq("id", userId)
    .maybeSingle();

  if (error) throw error;

  const usage = normalizeUsageFromPerfil(perfil ?? {});

  if (isPremiumActive(perfil)) {
    return { allowed: true, usage, perfil };
  }

  const used = isSameUsageDay(perfil?.uso_ia_mes, day)
    ? Number(perfil?.roteiros_ia) || 0
    : 0;

  if (used >= LIMITS.roteiro) {
    return deniedResponse(
      "LIMIT_REACHED",
      `Você usou seus ${LIMITS.roteiro} roteiros com IA de hoje. O limite reinicia à meia-noite. Assine o Premium por R$9,90/mês para uso ilimitado.`,
      enrichUsageWithDailyReset(usage)
    );
  }

  const buscasAtual = isSameUsageDay(perfil?.uso_ia_mes, day)
    ? Number(perfil?.buscas_ia) || 0
    : 0;

  const nextPerfil = buildOptimisticPerfil(perfil, day, {
    roteiros_ia: used + 1,
    buscas_ia: buscasAtual,
  });

  await persistUsageCounters(supabase, userId, user, perfil, day, {
    roteiros_ia: used + 1,
    buscas_ia: buscasAtual,
  });

  return {
    allowed: true,
    usage: normalizeUsageFromPerfil(nextPerfil),
    perfil: nextPerfil,
  };
}

/**
 * Verifica (e opcionalmente incrementa) acesso à busca com IA.
 * @param {string|null|undefined} userId
 * @param {{ increment?: boolean, user?: import('@supabase/supabase-js').User|null }} [options]
 * @returns {Promise<ServerAccessResult>}
 */
export async function checkBuscaAccess(userId, { increment = false, user = null } = {}) {
  if (!userId) {
    return deniedResponse("LOGIN_REQUIRED", "Faça login para usar a busca com IA.");
  }

  const supabase = await createClient();

  if (!user) {
    const { data: authData } = await supabase.auth.getUser();
    user = authData.user;
  }

  if (increment) {
    const rpcResult = await incrementViaRpc(supabase, "increment_busca_ia", userId);
    if (rpcResult) return rpcResult;

    try {
      return await incrementBuscaFallback(supabase, userId, user);
    } catch {
      const day = getUsageDayKey();
      const used = 1;
      return {
        allowed: true,
        usage: normalizeUsageFromPerfil({
          uso_ia_mes: day,
          buscas_ia: used,
          roteiros_ia: 0,
        }),
      };
    }
  }

  const usage = await getPerfilUsage(userId);
  const { data: perfil } = await supabase
    .from("perfis")
    .select(PERFIL_USAGE_SELECT)
    .eq("id", userId)
    .maybeSingle();

  if (isPremiumActive(perfil)) {
    return { allowed: true, usage, perfil };
  }

  if (usage.buscas.used >= LIMITS.busca) {
    return deniedResponse(
      "LIMIT_REACHED",
      `Você usou suas ${LIMITS.busca} buscas com IA de hoje. O limite reinicia à meia-noite. Assine o Premium por R$9,90/mês para uso ilimitado.`,
      enrichUsageWithDailyReset(usage)
    );
  }

  return { allowed: true, usage, perfil };
}

/**
 * Verifica (e opcionalmente incrementa) acesso à geração de roteiro com IA.
 * @param {string|null|undefined} userId
 * @param {{ increment?: boolean, user?: import('@supabase/supabase-js').User|null }} [options]
 * @returns {Promise<ServerAccessResult>}
 */
export async function checkRoteiroAccess(userId, { increment = false, user = null } = {}) {
  if (!userId) {
    return deniedResponse("LOGIN_REQUIRED", "Faça login para criar roteiros com IA.");
  }

  const supabase = await createClient();

  if (!user) {
    const { data: authData } = await supabase.auth.getUser();
    user = authData.user;
  }

  if (increment) {
    const rpcResult = await incrementViaRpc(supabase, "increment_roteiro_ia", userId);
    if (rpcResult) return rpcResult;

    try {
      return await incrementRoteiroFallback(supabase, userId, user);
    } catch {
      const day = getUsageDayKey();
      return {
        allowed: true,
        usage: normalizeUsageFromPerfil({
          uso_ia_mes: day,
          buscas_ia: 0,
          roteiros_ia: 1,
        }),
      };
    }
  }

  const usage = await getPerfilUsage(userId);
  const { data: perfil } = await supabase
    .from("perfis")
    .select(PERFIL_USAGE_SELECT)
    .eq("id", userId)
    .maybeSingle();

  if (isPremiumActive(perfil)) {
    return { allowed: true, usage, perfil };
  }

  if (usage.roteiros.used >= LIMITS.roteiro) {
    return deniedResponse(
      "LIMIT_REACHED",
      `Você usou seus ${LIMITS.roteiro} roteiros com IA de hoje. O limite reinicia à meia-noite. Assine o Premium por R$9,90/mês para uso ilimitado.`,
      enrichUsageWithDailyReset(usage)
    );
  }

  return { allowed: true, usage, perfil };
}
