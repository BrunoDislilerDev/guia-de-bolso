import { createClient } from "@/lib/supabase/server";
import {
  LIMITS,
  getUsageMonthKey,
  isPremiumActive,
  normalizeUsageFromPerfil,
} from "@/lib/premium";

const PERFIL_USAGE_SELECT =
  "id, premium_ativo, premium_ate, uso_ia_mes, buscas_ia, roteiros_ia";

export async function getAuthUser() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  return { supabase, user };
}

function getDisplayName(user) {
  return (
    user?.user_metadata?.full_name ??
    user?.user_metadata?.name ??
    user?.email?.split("@")[0] ??
    "Usuário"
  );
}

function mapRpcUsage(usageJson) {
  if (!usageJson || typeof usageJson !== "object") {
    return normalizeUsageFromPerfil({});
  }

  return {
    premium: Boolean(usageJson.premium),
    month: usageJson.month ?? getUsageMonthKey(),
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
}

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

function deniedResponse(code, message, usage) {
  return {
    allowed: false,
    code,
    message,
    usage,
    status: code === "LOGIN_REQUIRED" ? 401 : 403,
  };
}

function buildOptimisticPerfil(perfil, month, fields) {
  return {
    ...(perfil ?? {}),
    uso_ia_mes: month,
    ...fields,
  };
}

async function persistUsageCounters(supabase, userId, user, perfil, month, fields) {
  const payload = {
    uso_ia_mes: month,
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

async function incrementBuscaFallback(supabase, userId, user) {
  const month = getUsageMonthKey();

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

  const used =
    perfil?.uso_ia_mes === month ? Number(perfil?.buscas_ia) || 0 : 0;

  if (used >= LIMITS.busca) {
    return deniedResponse(
      "LIMIT_REACHED",
      `Você usou suas ${LIMITS.busca} buscas com IA deste mês. Assine o Premium por R$9,90/mês para uso ilimitado.`,
      usage
    );
  }

  const roteirosAtual =
    perfil?.uso_ia_mes === month ? Number(perfil?.roteiros_ia) || 0 : 0;

  const nextPerfil = buildOptimisticPerfil(perfil, month, {
    buscas_ia: used + 1,
    roteiros_ia: roteirosAtual,
  });

  await persistUsageCounters(supabase, userId, user, perfil, month, {
    buscas_ia: used + 1,
    roteiros_ia: roteirosAtual,
  });

  return {
    allowed: true,
    usage: normalizeUsageFromPerfil(nextPerfil),
    perfil: nextPerfil,
  };
}

async function incrementRoteiroFallback(supabase, userId, user) {
  const month = getUsageMonthKey();

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

  const used =
    perfil?.uso_ia_mes === month ? Number(perfil?.roteiros_ia) || 0 : 0;

  if (used >= LIMITS.roteiro) {
    return deniedResponse(
      "LIMIT_REACHED",
      `Você usou seus ${LIMITS.roteiro} roteiros com IA deste mês. Assine o Premium por R$9,90/mês para uso ilimitado.`,
      usage
    );
  }

  const buscasAtual =
    perfil?.uso_ia_mes === month ? Number(perfil?.buscas_ia) || 0 : 0;

  const nextPerfil = buildOptimisticPerfil(perfil, month, {
    roteiros_ia: used + 1,
    buscas_ia: buscasAtual,
  });

  await persistUsageCounters(supabase, userId, user, perfil, month, {
    roteiros_ia: used + 1,
    buscas_ia: buscasAtual,
  });

  return {
    allowed: true,
    usage: normalizeUsageFromPerfil(nextPerfil),
    perfil: nextPerfil,
  };
}

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
      const month = getUsageMonthKey();
      const used = 1;
      return {
        allowed: true,
        usage: normalizeUsageFromPerfil({
          uso_ia_mes: month,
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
      `Você usou suas ${LIMITS.busca} buscas com IA deste mês. Assine o Premium por R$9,90/mês para uso ilimitado.`,
      usage
    );
  }

  return { allowed: true, usage, perfil };
}

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
      const month = getUsageMonthKey();
      return {
        allowed: true,
        usage: normalizeUsageFromPerfil({
          uso_ia_mes: month,
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
      `Você usou seus ${LIMITS.roteiro} roteiros com IA deste mês. Assine o Premium por R$9,90/mês para uso ilimitado.`,
      usage
    );
  }

  return { allowed: true, usage, perfil };
}
