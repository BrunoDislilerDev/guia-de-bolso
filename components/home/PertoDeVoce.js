"use client";

import Link from "next/link";
import PlaceCard from "@/components/PlaceCard";

/**
 * PertoDeVoce - Nearby places carousel or login prompt for geolocation.
 * @param {object} props
 * @param {object|null} props.user - Authenticated Supabase user, or null.
 * @param {object[]} [props.lugares] - Nearby place records sorted by distance.
 * @param {(lugar: object) => boolean} props.isFavorito - Returns whether a place is favorited.
 * @param {(lugar: object) => void} props.onFavoritar - Favorite toggle handler.
 * @returns {import('react').ReactElement}
 */
export default function PertoDeVoce({
  user,
  lugares = [],
  isFavorito,
  onFavoritar,
}) {
  return (
    <section className="mb-4">
      <div className="mb-4 flex items-center justify-between gap-2">
        <div>
          <p className="text-xs font-medium text-[#5a6b66]">Descoberta complementar</p>
          <h2 className="text-lg font-bold text-[#1a2e28]">Perto de você</h2>
        </div>
      </div>

      {!user ? (
        <div className="rounded-3xl bg-[#d4ede8] p-4 text-[#1a4a3a] shadow-sm">
          <div className="flex items-start gap-3">
            <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-white/70 text-lg">
              📍
            </div>
            <div>
              <h3 className="font-bold">Ative sua localização</h3>
              <p className="mt-1 text-sm text-[#1a4a3a]/75">
                Faça login para ver o que está perto de você agora.
              </p>
            </div>
          </div>
          <Link
            href="/login"
            className="mt-4 block rounded-xl bg-[#1a4a3a] py-3 text-center text-sm font-semibold text-white"
          >
            Entrar
          </Link>
        </div>
      ) : lugares.length === 0 ? (
        <p className="rounded-2xl bg-white py-8 text-center text-sm text-[#5a6b66] shadow-sm">
          Nenhum lugar por perto no momento.
        </p>
      ) : (
        <div className="flex gap-3 overflow-x-auto pb-1 scrollbar-hide [&::-webkit-scrollbar]:hidden">
          {lugares.map((lugar, index) => (
            <div key={lugar.id} className="w-[285px] shrink-0">
              <PlaceCard
                lugar={lugar}
                isFavorito={isFavorito(lugar)}
                onFavoritar={onFavoritar}
                priority={index === 0}
              />
            </div>
          ))}
        </div>
      )}
    </section>
  );
}
