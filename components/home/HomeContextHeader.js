"use client";

import Link from "next/link";
import Logo from "@/components/Logo";

/**
 * HomeContextHeader - Home page title, location with weather, and profile link.
 * @param {object} props
 * @param {object|null} props.user - Authenticated Supabase user, or null.
 * @param {string|null} props.avatarUrl - Profile photo URL when available.
 * @param {string} [props.locationLabel] - Display label for the current area.
 * @param {number|null} [props.temperatura] - Current regional temperature (°C).
 * @param {string|null} [props.weatherEmoji] - Weather icon from Open-Meteo mapping.
 * @param {string|null} [props.weatherCondition] - Human-readable condition for a11y.
 * @param {boolean} [props.climaLoading=false] - Weather data still loading.
 * @param {boolean} [props.climaErro=false] - Weather fetch failed.
 * @param {(user: object) => string} props.getUserInitial - Returns avatar fallback initial.
 * @returns {import('react').ReactElement}
 */
export default function HomeContextHeader({
  user,
  avatarUrl,
  locationLabel = "Imbituba, SC",
  temperatura = null,
  weatherEmoji = null,
  weatherCondition = null,
  climaLoading = false,
  climaErro = false,
  getUserInitial,
}) {
  const nome =
    user?.user_metadata?.full_name ||
    user?.user_metadata?.name ||
    user?.email?.split("@")[0] ||
    "Usuário";

  const tempNum = Number(temperatura);
  const tempExibicao = Number.isFinite(tempNum) ? `${Math.round(tempNum)}°` : null;
  const mostrarClima = !climaLoading && (tempExibicao || climaErro);
  const tempLabel = tempExibicao || (climaErro ? "--°" : null);

  const locationAria = weatherCondition && tempExibicao
    ? `${locationLabel}, ${Math.round(tempNum)} graus, ${weatherCondition}`
    : locationLabel;

  return (
    <header className="mb-5">
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0 flex-1">
          <div className="flex items-center gap-2.5">
            <Logo size="md" variant="default" />
            <p className="text-sm font-semibold uppercase tracking-[0.12em] text-[#1a4a3a]/80">
              Guia de Bolso
            </p>
          </div>
          <h1 className="mt-1 font-display text-[1.65rem] font-bold leading-tight tracking-tight text-[#1a2e28]">
            O que fazer <span className="text-[#1a4a3a]">agora</span>
          </h1>
          <p
            className="mt-2 flex flex-wrap items-center gap-x-2 gap-y-1 text-sm text-[#5a6b66]"
            aria-label={locationAria}
          >
            <span className="flex min-w-0 items-center gap-1.5">
              <svg
                className="h-3.5 w-3.5 shrink-0 text-[#1a4a3a]"
                viewBox="0 0 24 24"
                fill="currentColor"
                aria-hidden
              >
                <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5a2.5 2.5 0 110-5 2.5 2.5 0 010 5z" />
              </svg>
              <span className="truncate">{locationLabel}</span>
            </span>

            {climaLoading && (
              <span
                className="h-4 w-16 animate-pulse rounded-md bg-[#d4ede8]/80"
                aria-hidden
              />
            )}

            {mostrarClima && tempLabel && (
              <>
                <span className="text-[#c5d4cf]" aria-hidden>
                  ·
                </span>
                <span className="inline-flex items-center gap-1.5 font-semibold tabular-nums text-[#1a4a3a]">
                  <span aria-hidden>{tempLabel}</span>
                  {weatherEmoji && (
                    <span className="text-base leading-none" role="img" aria-hidden>
                      {weatherEmoji}
                    </span>
                  )}
                </span>
              </>
            )}
          </p>
        </div>

        <Link
          href={user ? "/perfil" : "/login"}
          className="flex h-12 w-12 shrink-0 items-center justify-center overflow-hidden rounded-2xl bg-white text-[#1a4a3a] shadow-md ring-1 ring-black/5"
          aria-label={user ? "Abrir perfil" : "Entrar"}
        >
          {user && avatarUrl ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img src={avatarUrl} alt={nome} className="h-full w-full object-cover" />
          ) : user ? (
            <span className="flex h-full w-full items-center justify-center bg-[#1a4a3a] text-sm font-bold text-white">
              {getUserInitial(user)}
            </span>
          ) : (
            <svg
              className="h-5 w-5"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              aria-hidden
            >
              <path d="M20 21v-2a4 4 0 00-4-4H8a4 4 0 00-4 4v2" />
              <path d="M12 11a4 4 0 100-8 4 4 0 000 8z" />
            </svg>
          )}
        </Link>
      </div>
    </header>
  );
}
