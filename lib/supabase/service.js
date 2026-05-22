import { createClient as createSupabaseClient } from "@supabase/supabase-js";

/**
 * Cliente Supabase com service role (apenas server-side, ex.: feedback de visitante).
 * Requer `SUPABASE_SERVICE_ROLE_KEY` no ambiente.
 * @returns {import('@supabase/supabase-js').SupabaseClient|null}
 */
export function createServiceClient() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY;

  if (!url || !key) return null;

  return createSupabaseClient(url, key, {
    auth: { persistSession: false, autoRefreshToken: false },
  });
}
