export const PREMIUM_PRICE = 9.9;
export const PREMIUM_PRICE_LABEL = "R$9,90/mês";

export const LIMITS = {
  busca: 3,
  roteiro: 2,
};

export function getUsageMonthKey(date = new Date()) {
  return new Intl.DateTimeFormat("en-CA", {
    timeZone: "America/Sao_Paulo",
    year: "numeric",
    month: "2-digit",
  }).format(date);
}

export function isPremiumActive(perfil) {
  if (!perfil?.premium_ativo) return false;
  if (!perfil.premium_ate) return true;
  return new Date(perfil.premium_ate) > new Date();
}

export function normalizeUsageFromPerfil(perfil) {
  const month = getUsageMonthKey();
  const sameMonth = perfil?.uso_ia_mes === month;

  const buscas = sameMonth ? Number(perfil?.buscas_ia) || 0 : 0;
  const roteiros = sameMonth ? Number(perfil?.roteiros_ia) || 0 : 0;
  const premium = isPremiumActive(perfil);

  return {
    premium,
    month,
    buscas: {
      used: buscas,
      limit: LIMITS.busca,
      remaining: premium ? null : Math.max(0, LIMITS.busca - buscas),
    },
    roteiros: {
      used: roteiros,
      limit: LIMITS.roteiro,
      remaining: premium ? null : Math.max(0, LIMITS.roteiro - roteiros),
    },
    climaDetalhes: {
      requiresPremium: !premium,
    },
  };
}

/** Uso padrão quando o perfil ainda não carregou ou colunas premium não existem. */
export function createDefaultUsage(perfil = {}) {
  return normalizeUsageFromPerfil(perfil);
}

export function canUseBusca(usage, isLoggedIn = false) {
  if (!usage) {
    if (isLoggedIn) return { allowed: true, code: "DEFER_TO_API" };
    return { allowed: false, code: "LOGIN_REQUIRED" };
  }
  if (usage.premium) return { allowed: true };
  if (usage.buscas.used < LIMITS.busca) return { allowed: true };
  return { allowed: false, code: "LIMIT_REACHED" };
}

export function canUseRoteiro(usage, isLoggedIn = false) {
  if (!usage) {
    if (isLoggedIn) return { allowed: true, code: "DEFER_TO_API" };
    return { allowed: false, code: "LOGIN_REQUIRED" };
  }
  if (usage.premium) return { allowed: true };
  if (usage.roteiros.used < LIMITS.roteiro) return { allowed: true };
  return { allowed: false, code: "LIMIT_REACHED" };
}

export function canViewClimaDetalhes(usage, isLoggedIn = false) {
  if (!isLoggedIn) {
    return { allowed: false, code: "LOGIN_REQUIRED" };
  }
  if (!usage) {
    return { allowed: false, code: "PREMIUM_REQUIRED" };
  }
  if (usage.premium) return { allowed: true };
  return { allowed: false, code: "PREMIUM_REQUIRED" };
}
