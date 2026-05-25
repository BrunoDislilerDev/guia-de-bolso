"use client";

import Link from "next/link";
import PlaceCard from "@/components/PlaceCard";
import HomeSectionHeader from "@/components/home/HomeSectionHeader";
import { HOME_CAROUSEL_TRACK_CLASS } from "@/components/home/homeTokens";

/**
 * PertoDeVoce - Nearby places carousel or login prompt for geolocation.
 */
export default function PertoDeVoce({
  user,
  lugares = [],
  isFavorito,
  onFavoritar,
}) {
  return (
    <section className="mb-6 home-reveal overflow-visible" style={{ animationDelay: "160ms" }}>
      <HomeSectionHeader eyebrow="Descoberta complementar" title="Perto de você" />

      {!user ? (
        <div className="overflow-hidden rounded-[28px] bg-gradient-to-br from-[#d4ede8] to-[#e8f5f1] p-5 text-[#1a4a3a] shadow-[0_8px_28px_rgba(26,74,58,0.1)] ring-1 ring-white/50">
          <div className="flex items-start gap-3">
            <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-white/80 text-lg shadow-sm">
              📍
            </div>
            <div>
              <h3 className="font-bold tracking-tight">Ative sua localização</h3>
              <p className="mt-1 text-sm text-[#1a4a3a]/75">
                Faça login para ver o que está perto de você agora.
              </p>
            </div>
          </div>
          <Link
            href="/login"
            className="mt-4 block rounded-2xl bg-[#1a4a3a] py-3.5 text-center text-sm font-bold text-white shadow-[0_6px_20px_rgba(26,74,58,0.3)] transition-transform active:scale-[0.98]"
          >
            Entrar
          </Link>
        </div>
      ) : lugares.length === 0 ? (
        <p className="rounded-[24px] bg-white/90 py-10 text-center text-sm text-[#5a6b66] shadow-[0_4px_20px_rgba(26,46,40,0.06)] ring-1 ring-[#e8eeee]">
          Nenhum lugar por perto no momento.
        </p>
      ) : (
        <div className={`${HOME_CAROUSEL_TRACK_CLASS} gap-3.5 -mx-4 px-4`}>
          {lugares.map((lugar, index) => (
            <div key={lugar.id} className="w-[300px] shrink-0 snap-start">
              <PlaceCard
                lugar={lugar}
                variant="immersive"
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
