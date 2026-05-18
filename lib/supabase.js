import { createClient as createSupabaseClient } from "@supabase/supabase-js";

export { createClient } from "./supabase/client";
export { createClient as createServerClient } from "./supabase/server";

/**
 * Cliente anônimo para operações públicas em Route Handlers
 * que não dependem da sessão do usuário.
 */
export const supabase = createSupabaseClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
);
