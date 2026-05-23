import { createClient } from "@supabase/supabase-js";

/** @type {import('@supabase/supabase-js').SupabaseClient | null} */
let anonServerClient = null;

/**
 * Cliente Supabase só com anon key (sem sessão do browser).
 * Usado em Route Handlers para leitura pública de lugares — evita RLS quebrada para `authenticated`.
 * @returns {import('@supabase/supabase-js').SupabaseClient | null}
 */
export function getAnonServerClient() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL?.trim();
  const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY?.trim();
  if (!url || !key) return null;

  if (!anonServerClient) {
    anonServerClient = createClient(url, key, {
      auth: { persistSession: false, autoRefreshToken: false },
    });
  }
  return anonServerClient;
}
