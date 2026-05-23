import { createBrowserClient } from "@supabase/ssr";

/** @type {import('@supabase/supabase-js').SupabaseClient | undefined} */
let browserClient;

/**
 * Cria (ou reutiliza) o cliente Supabase do browser — uma única instância evita
 * múltiplos GoTrueClient e sessão inconsistente entre componentes e `/api/uso-premium`.
 * @returns {import('@supabase/supabase-js').SupabaseClient}
 */
export function createClient() {
  if (!browserClient) {
    browserClient = createBrowserClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
    );
  }
  return browserClient;
}
