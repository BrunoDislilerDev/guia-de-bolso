/**
 * Cliente Supabase do browser (singleton).
 * APIs sem sessão: `@/lib/supabase/anon`.
 * Servidor com cookies: `@/lib/supabase/server`.
 */
export { createClient } from "./supabase/client";
