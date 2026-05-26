import { createClient as createSupabaseClient } from "@supabase/supabase-js";

/**
 * Cliente anônimo para Route Handlers sem cookies de sessão.
 * Não importar em componentes client.
 * @type {import('@supabase/supabase-js').SupabaseClient}
 */
export const supabase = createSupabaseClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
);
