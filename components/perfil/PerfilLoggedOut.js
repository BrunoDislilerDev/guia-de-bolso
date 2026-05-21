"use client";

import Link from "next/link";
import AuthFlow from "@/components/AuthFlow";
import { PERFIL_BENEFICIOS } from "@/lib/perfil";

/**
 * @returns {import("react").JSX.Element}
 */
function IconPersonLarge() {
  return (
    <svg className="h-14 w-14" viewBox="0 0 24 24" fill="currentColor" aria-hidden>
      <path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z" />
    </svg>
  );
}

/**
 * Estado deslogado da aba Perfil.
 * @returns {import("react").JSX.Element}
 */
export default function PerfilLoggedOut() {
  return (
    <div className="space-y-6">
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-[#1a4a3a] via-[#1a4a3a] to-[#0f3028] px-6 py-8 text-center text-white shadow-md">
        <div
          className="pointer-events-none absolute -right-8 -top-8 h-32 w-32 rounded-full bg-white/10"
          aria-hidden
        />
        <div
          className="pointer-events-none absolute -bottom-10 -left-6 h-28 w-28 rounded-full bg-white/5"
          aria-hidden
        />
        <div className="relative mx-auto flex h-20 w-20 items-center justify-center rounded-full bg-white/15 ring-4 ring-white/20">
          <IconPersonLarge />
        </div>
        <h2 className="relative mt-5 text-xl font-bold leading-tight">
          Entre e personalize sua viagem
        </h2>
        <p className="relative mt-2 text-sm leading-relaxed text-white/85">
          Favoritos, avaliações, rotas com IA e preferências salvas na sua conta.
        </p>
      </div>

      <section aria-labelledby="perfil-beneficios-title">
        <h2
          id="perfil-beneficios-title"
          className="mb-3 text-xs font-bold uppercase tracking-[0.12em] text-[#5a6b66]"
        >
          O que você ganha
        </h2>
        <div className="grid grid-cols-2 gap-3">
          {PERFIL_BENEFICIOS.map((item) => (
            <div
              key={item.id}
              className="rounded-2xl bg-white p-4 shadow-sm ring-1 ring-[#e8eeee]"
            >
              <span className="text-2xl" aria-hidden>
                {item.emoji}
              </span>
              <p className="mt-2 text-sm font-bold text-[#1a2e28]">{item.titulo}</p>
              <p className="mt-1 text-xs leading-snug text-[#5a6b66]">
                {item.descricao}
              </p>
            </div>
          ))}
        </div>
      </section>

      <div className="rounded-3xl bg-white p-5 shadow-sm ring-1 ring-[#e8eeee]">
        <p className="mb-4 text-center text-sm font-semibold text-[#1a2e28]">
          Criar conta ou entrar
        </p>
        <AuthFlow compact />
      </div>

      <Link
        href="/"
        className="block text-center text-sm font-medium text-[#5a6b66] underline-offset-2 hover:text-[#1a4a3a] hover:underline"
      >
        Continuar sem login
      </Link>
    </div>
  );
}
