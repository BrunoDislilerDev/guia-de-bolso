"use client";

import { useCallback, useEffect, useState } from "react";
import { createDefaultUsage } from "@/lib/premium";

function storageKey(userId) {
  return `guia_premium_usage_${userId}`;
}

function readStoredUsage(userId) {
  if (!userId || typeof window === "undefined") return null;
  try {
    const raw = localStorage.getItem(storageKey(userId));
    if (!raw) return null;
    return JSON.parse(raw);
  } catch {
    return null;
  }
}

function writeStoredUsage(userId, usage) {
  if (!userId || !usage || typeof window === "undefined") return;
  try {
    localStorage.setItem(storageKey(userId), JSON.stringify(usage));
  } catch {
    // ignore
  }
}

function mergeUsagePreferHigher(serverUsage, localUsage) {
  if (!localUsage) return serverUsage;
  if (!serverUsage) return localUsage;
  if (localUsage.month !== serverUsage.month) return serverUsage;

  const buscasUsed = Math.max(serverUsage.buscas.used, localUsage.buscas.used);
  const roteirosUsed = Math.max(serverUsage.roteiros.used, localUsage.roteiros.used);

  return {
    ...serverUsage,
    buscas: {
      ...serverUsage.buscas,
      used: buscasUsed,
      remaining:
        serverUsage.premium || serverUsage.buscas.remaining === null
          ? null
          : Math.max(0, serverUsage.buscas.limit - buscasUsed),
    },
    roteiros: {
      ...serverUsage.roteiros,
      used: roteirosUsed,
      remaining:
        serverUsage.premium || serverUsage.roteiros.remaining === null
          ? null
          : Math.max(0, serverUsage.roteiros.limit - roteirosUsed),
    },
  };
}

export function usePremiumUsage(user) {
  const userId = user?.id ?? null;
  const [usage, setUsageState] = useState(null);
  const [loading, setLoading] = useState(Boolean(user));

  const applyUsage = useCallback(
    (nextUsage) => {
      if (!nextUsage) return null;
      setUsageState(nextUsage);
      if (userId) writeStoredUsage(userId, nextUsage);
      return nextUsage;
    },
    [userId]
  );

  const refresh = useCallback(async () => {
    if (!userId) {
      setUsageState(null);
      setLoading(false);
      return null;
    }

    setLoading(true);

    try {
      const response = await fetch("/api/uso-premium", {
        credentials: "same-origin",
        cache: "no-store",
      });
      const data = await response.json();
      const local = readStoredUsage(userId);

      if (response.ok && data.loggedIn) {
        const fromServer = data.usage ?? createDefaultUsage();
        const merged = mergeUsagePreferHigher(fromServer, local);
        applyUsage(merged);
        return merged;
      }

      if (local) {
        applyUsage(local);
        return local;
      }

      const fallback = createDefaultUsage();
      applyUsage(fallback);
      return fallback;
    } catch {
      const local = readStoredUsage(userId);
      if (local) {
        applyUsage(local);
        return local;
      }
      return null;
    } finally {
      setLoading(false);
    }
  }, [userId, applyUsage]);

  useEffect(() => {
    refresh();
  }, [refresh]);

  return {
    usage,
    loading,
    refresh,
    setUsage: applyUsage,
  };
}
