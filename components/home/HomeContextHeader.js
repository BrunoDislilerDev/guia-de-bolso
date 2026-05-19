"use client";

import Link from "next/link";

export default function HomeContextHeader({
  user,
  avatarUrl,
  contextualPhrase,
  locationLabel = "Imbituba, SC",
  getUserInitial,
}) {
  return (
    <header className="mb-5">
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0 flex-1">
          <p className="text-xs font-semibold uppercase tracking-[0.14em] text-[#1a4a3a]/70">
            Guia de bolso
          </p>
          <h1 className="mt-1 font-display text-[1.65rem] font-bold leading-tight tracking-tight text-[#1a2e28]">
            O que fazer <span className="text-[#1a4a3a]">agora</span>
          </h1>
          <p className="mt-2 flex items-center gap-1.5 text-sm text-[#5a6b66]">
            <svg className="h-3.5 w-3.5 shrink-0 text-[#1a4a3a]" viewBox="0 0 24 24" fill="currentColor" aria-hidden>
              <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5a2.5 2.5 0 110-5 2.5 2.5 0 010 5z" />
            </svg>
            <span className="truncate">{locationLabel}</span>
          </p>
        </div>

        <Link
          href={user ? "/perfil" : "/login"}
          className="flex h-12 w-12 shrink-0 items-center justify-center overflow-hidden rounded-2xl bg-white text-[#1a4a3a] shadow-md ring-1 ring-black/5"
          aria-label={user ? "Abrir perfil" : "Entrar"}
        >
          {user && avatarUrl ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img src={avatarUrl} alt="" className="h-full w-full object-cover" />
          ) : user ? (
            <span className="text-sm font-bold text-white flex h-full w-full items-center justify-center bg-[#1a4a3a]">
              {getUserInitial(user)}
            </span>
          ) : (
            <svg className="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden>
              <path d="M20 21v-2a4 4 0 00-4-4H8a4 4 0 00-4 4v2" />
              <path d="M12 11a4 4 0 100-8 4 4 0 000 8z" />
            </svg>
          )}
        </Link>
      </div>

      <div className="mt-4 rounded-2xl border border-[#d4ede8] bg-gradient-to-r from-white via-[#f7fbf9] to-[#eef6f2] px-4 py-3.5 shadow-sm">
        <p className="text-sm font-medium leading-relaxed text-[#1a4a3a]">
          <span className="mr-1.5" aria-hidden>
            ✨
          </span>
          {contextualPhrase}
        </p>
      </div>
    </header>
  );
}
