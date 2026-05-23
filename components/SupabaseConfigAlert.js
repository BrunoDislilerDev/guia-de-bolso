"use client";

import { SUPABASE_CONFIG_HELP } from "@/lib/supabase/publicEnv";

/**
 * Aviso quando o app foi buildado sem variáveis NEXT_PUBLIC do Supabase (comum na Vercel).
 * @returns {import("react").JSX.Element|null}
 */
export default function SupabaseConfigAlert() {
  const configured = Boolean(
    process.env.NEXT_PUBLIC_SUPABASE_URL?.trim() &&
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY?.trim()
  );

  if (configured) return null;

  return (
    <div
      className="mb-4 rounded-2xl border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-950"
      role="alert"
    >
      <p className="font-semibold">Conteúdo indisponível — Supabase não configurado no deploy</p>
      <p className="mt-1 leading-relaxed text-amber-900/90">{SUPABASE_CONFIG_HELP}</p>
      <p className="mt-2 text-xs text-amber-800/80">
        Use a chave <strong>anon / publishable</strong> do painel Supabase (não a service role).
      </p>
    </div>
  );
}
