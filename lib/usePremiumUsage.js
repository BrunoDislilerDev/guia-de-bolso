"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import {
  enrichUsageWithDailyReset,
  getMsUntilDailyReset,
  getUsageDayKey,
} from "@/lib/premium";

/**
 * Gera chave de `localStorage` para cache de uso premium por usuário.
 * @param {string} userId
 * @returns {string}
 */
function storageKey(userId) {
  return `guia_premium_usage_${userId}`;
}

/**
 * Lê uso premium em cache local.
 * @param {string} userId
 * @returns {import('@/lib/premium').PremiumUsage|null}
 */
function readStoredUsage(userId) {
  if (!userId || typeof window === "undefined") return null;
  try {
    const raw = localStorage.getItem(storageKey(userId));
    if (!raw) return null;
    const parsed = JSON.parse(raw);
    return enrichUsageWithDailyReset(parsed);
  } catch {
    return null;
  }
}

/**
 * Persiste uso premium no `localStorage`.
 * @param {string} userId
 * @param {import('@/lib/premium').PremiumUsage} usage
 * @returns {void}
 */
function writeStoredUsage(userId, usage) {
  if (!userId || !usage || typeof window === "undefined") return;
  try {
    localStorage.setItem(storageKey(userId), JSON.stringify(usage));
  } catch {
    // ignore
  }
}

/**
 * Cache válido apenas para o dia corrente (fuso SP).
 * @param {import('@/lib/premium').PremiumUsage|null} usage
 * @returns {boolean}
 */
function isValidCachedUsage(usage) {
  if (!usage) return false;
  const today = getUsageDayKey();
  const cachedDay = usage.day ?? usage.month;
  return cachedDay === today;
}

/**
 * @typedef {Object} UsePremiumUsageResult
 * @property {import('@/lib/premium').PremiumUsage|null} usage - Estado de uso atual.
 * @property {boolean} loading - Se está buscando dados no servidor.
 * @property {boolean} synced - Se já concluiu pelo menos uma sincronização com a API (nesta sessão).
 * @property {() => Promise<import('@/lib/premium').PremiumUsage|null>} refresh - Recarrega da API.
 * @property {(next: import('@/lib/premium').PremiumUsage) => import('@/lib/premium').PremiumUsage|null} setUsage - Atualiza estado e cache local.
 */

/**
 * Hook React para controle de uso Premium (buscas, roteiros, clima).
 * Hidrata do `localStorage` no mesmo dia e sincroniza com `/api/uso-premium`.
 * @param {import('@supabase/supabase-js').User|null} user - Usuário autenticado.
 * @returns {UsePremiumUsageResult}
 */
export function usePremiumUsage(user) {
  const userId = user?.id ?? null;
  const [usage, setUsageState] = useState(null);
  const [loading, setLoading] = useState(false);
  const [synced, setSynced] = useState(!userId);
  const fetchIdRef = useRef(0);

  const applyUsage = useCallback(
    (nextUsage) => {
      if (!nextUsage) return null;
      const enriched = enrichUsageWithDailyReset(nextUsage);
      setUsageState(enriched);
      if (userId) writeStoredUsage(userId, enriched);
      return enriched;
    },
    [userId]
  );

  useEffect(() => {
    if (!userId) {
      setUsageState(null);
      setLoading(false);
      setSynced(true);
      return;
    }

    const cached = readStoredUsage(userId);
    if (isValidCachedUsage(cached)) {
      setUsageState(cached);
    } else {
      setUsageState(null);
    }
    setSynced(false);
  }, [userId]);

  const refresh = useCallback(async () => {
    if (!userId) {
      setUsageState(null);
      setLoading(false);
      setSynced(true);
      return null;
    }

    const fetchId = ++fetchIdRef.current;
    setLoading(true);

    try {
      const response = await fetch("/api/uso-premium", {
        credentials: "same-origin",
        cache: "no-store",
      });
      const data = await response.json();

      if (fetchId !== fetchIdRef.current) return null;

      if (response.ok && data.loggedIn && data.usage) {
        const serverUsage = enrichUsageWithDailyReset(data.usage);
        applyUsage(serverUsage);
        return serverUsage;
      }

      const cached = readStoredUsage(userId);
      if (isValidCachedUsage(cached)) {
        setUsageState(cached);
        return cached;
      }

      return null;
    } catch {
      if (fetchId !== fetchIdRef.current) return null;

      const cached = readStoredUsage(userId);
      if (isValidCachedUsage(cached)) {
        setUsageState(cached);
        return cached;
      }

      return null;
    } finally {
      if (fetchId === fetchIdRef.current) {
        setLoading(false);
        setSynced(true);
      }
    }
  }, [userId, applyUsage]);

  useEffect(() => {
    refresh();
  }, [refresh]);

  useEffect(() => {
    if (!userId) return undefined;

    function clearStaleCache() {
      try {
        localStorage.removeItem(storageKey(userId));
      } catch {
        // ignore
      }
    }

    function handleDayRollover() {
      const today = getUsageDayKey();
      setUsageState((current) => {
        if (!current) return current;
        const cachedDay = current.day ?? current.month;
        if (cachedDay === today) return current;
        return null;
      });
      clearStaleCache();
      refresh();
    }

    let timerId;

    function scheduleMidnightRefresh() {
      const ms = getMsUntilDailyReset();
      timerId = window.setTimeout(() => {
        handleDayRollover();
        scheduleMidnightRefresh();
      }, Math.min(ms + 500, 2_147_483_647));
    }

    scheduleMidnightRefresh();

    function onVisibilityChange() {
      if (document.visibilityState !== "visible") return;
      const today = getUsageDayKey();
      const cached = readStoredUsage(userId);
      const cachedDay = cached?.day ?? cached?.month;
      if (cachedDay && cachedDay !== today) {
        handleDayRollover();
        return;
      }
      refresh();
    }

    document.addEventListener("visibilitychange", onVisibilityChange);

    return () => {
      window.clearTimeout(timerId);
      document.removeEventListener("visibilitychange", onVisibilityChange);
    };
  }, [userId, refresh]);

  return {
    usage,
    loading,
    synced,
    refresh,
    setUsage: applyUsage,
  };
}
