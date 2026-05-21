"use client";

import Link from "next/link";
import { formatMembroDesde, getInitial } from "@/lib/perfil";

/**
 * Cabeçalho do perfil logado com avatar e edição.
 * @param {object} props
 * @param {string} props.nome
 * @param {string} [props.email]
 * @param {string} [props.avatarUrl]
 * @param {string} [props.membroDesde]
 * @param {boolean} [props.isPremium]
 * @returns {import("react").JSX.Element}
 */
export default function PerfilHero({
  nome,
  email,
  avatarUrl,
  membroDesde,
  isPremium = false,
}) {
  const desde = formatMembroDesde(membroDesde);

  return (
    <section className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-[#1a4a3a] via-[#174035] to-[#0f3028] px-5 pb-5 pt-6 text-white shadow-md">
      <div
        className="pointer-events-none absolute -right-6 top-4 h-24 w-24 rounded-full bg-white/10"
        aria-hidden
      />
      <div
        className="pointer-events-none absolute -bottom-8 left-8 h-20 w-20 rounded-full bg-white/5"
        aria-hidden
      />

      <div className="relative flex items-start gap-4">
        {avatarUrl ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={avatarUrl}
            alt=""
            className="h-[72px] w-[72px] shrink-0 rounded-full object-cover ring-4 ring-white/25"
          />
        ) : (
          <div className="flex h-[72px] w-[72px] shrink-0 items-center justify-center rounded-full bg-white/20 text-2xl font-bold ring-4 ring-white/25">
            {getInitial(nome)}
          </div>
        )}

        <div className="min-w-0 flex-1 pt-1">
          <div className="flex flex-wrap items-center gap-2">
            <h2 className="truncate text-xl font-bold leading-tight">{nome}</h2>
            {isPremium && (
              <span className="rounded-full bg-[#f5e6b8] px-2 py-0.5 text-[10px] font-bold uppercase tracking-wide text-[#7a6520]">
                Premium
              </span>
            )}
          </div>
          {email && (
            <p className="mt-1 truncate text-sm text-white/80">{email}</p>
          )}
          {desde && (
            <p className="mt-1 text-xs text-white/65">Membro desde {desde}</p>
          )}
        </div>
      </div>

      <Link
        href="/perfil/editar"
        className="relative mt-5 flex w-full items-center justify-center gap-2 rounded-xl bg-white/15 py-2.5 text-sm font-semibold text-white ring-1 ring-white/25 transition active:scale-[0.99] hover:bg-white/20"
      >
        Editar perfil
        <span aria-hidden>→</span>
      </Link>
    </section>
  );
}
