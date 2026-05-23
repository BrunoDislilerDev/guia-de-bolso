/** Mensagem exibida quando faltam variáveis públicas do Supabase no build (ex.: Vercel). */
export const SUPABASE_CONFIG_HELP =
  "Configure NEXT_PUBLIC_SUPABASE_URL e NEXT_PUBLIC_SUPABASE_ANON_KEY na Vercel (Settings → Environment Variables) e faça um novo deploy.";

/**
 * Lê URL e chave anon/publishable do Supabase (inlined no build pelo Next.js).
 * @returns {{ url: string, anonKey: string } | null}
 */
export function getSupabasePublicEnv() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL?.trim();
  const anonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY?.trim();

  if (!url || !anonKey) return null;
  return { url, anonKey };
}

/**
 * @returns {boolean}
 */
export function isSupabasePublicConfigured() {
  return getSupabasePublicEnv() !== null;
}
