import { createClient as createSupabaseClient } from "@supabase/supabase-js";

export { createClient } from "./supabase/client";

/**
 * Cliente anônimo para operações públicas em Route Handlers
 * que não dependem da sessão do usuário.
 * @type {import('@supabase/supabase-js').SupabaseClient}
 */
export const supabase = createSupabaseClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
);
