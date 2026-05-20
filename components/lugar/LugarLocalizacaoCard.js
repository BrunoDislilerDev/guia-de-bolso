"use client";

import { useEffect, useState } from "react";

/**
 * Ícone de mapa para o fallback quando a imagem estática falha.
 * @returns {import("react").ReactElement}
 */
function MapIcon() {
  return (
    <svg
      className="h-10 w-10 text-[#1a4a3a]"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.75"
      aria-hidden
    >
      <path d="M12 21s7-4.5 7-11a7 7 0 10-14 0c0 6.5 7 11 7 11z" />
      <circle cx="12" cy="10" r="2.5" />
    </svg>
  );
}

/**
 * Link estilizado para abrir o Google Maps quando o mapa estático não carrega.
 * @param {object} props
 * @param {string} props.href - URL do Google Maps.
 * @returns {import("react").ReactElement}
 */
function MapaFallbackLink({ href }) {
  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      className="flex h-48 w-full flex-col items-center justify-center gap-2 border-b border-[#e3e9e6] bg-[#eef6f2] text-[#1a4a3a]"
    >
      <MapIcon />
      <span className="text-sm font-semibold">Ver no Google Maps</span>
    </a>
  );
}

/**
 * Seção de localização com mapa estático, endereço e CTA para abrir no app de mapas.
 * @param {object} props
 * @param {string} props.endereco - Endereço formatado para exibição.
 * @param {string} [props.mapUrl] - URL do Google Maps (link acessível oculto).
 * @param {string} [props.staticMapSrc] - URL da imagem do mapa estático.
 * @param {number|string} [props.latitude] - Latitude para fallback.
 * @param {number|string} [props.longitude] - Longitude para fallback.
 * @param {string} props.nome - Nome do lugar (texto alternativo do mapa).
 * @param {() => void} props.onAbrirMapa - Abre o mapa no app preferido do usuário.
 * @returns {import("react").ReactElement}
 */
export default function LugarLocalizacaoCard({
  nome,
  endereco,
  mapUrl,
  staticMapSrc,
  latitude,
  longitude,
  onAbrirMapa,
}) {
  const [mapLoadFailed, setMapLoadFailed] = useState(false);

  const lat = Number(latitude);
  const lng = Number(longitude);
  const hasCoords = Number.isFinite(lat) && Number.isFinite(lng);
  const googleMapsHref = hasCoords
    ? `https://www.google.com/maps?q=${lat},${lng}`
    : mapUrl;

  const showStaticMap = Boolean(staticMapSrc) && !mapLoadFailed;

  useEffect(() => {
    setMapLoadFailed(false);
  }, [staticMapSrc]);

  useEffect(() => {
    if (staticMapSrc) {
      console.log("[LugarLocalizacaoCard] static map URL:", staticMapSrc);
    }
  }, [staticMapSrc]);

  if (!endereco?.trim()) return null;

  return (
    <section className="mt-5">
      <h2 className="mb-3 text-sm font-bold text-[#1a2e28]">Localização</h2>
      <div className="overflow-hidden rounded-2xl bg-white shadow-sm ring-1 ring-[#e8eeee]">
        {showStaticMap ? (
          <button
            type="button"
            onClick={onAbrirMapa}
            className="relative block w-full"
            aria-label="Abrir no mapa"
          >
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={staticMapSrc}
              alt={`Mapa de ${nome}`}
              className="h-48 w-full object-cover"
              onError={() => setMapLoadFailed(true)}
            />
            <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/25 to-transparent" />
          </button>
        ) : googleMapsHref ? (
          <MapaFallbackLink href={googleMapsHref} />
        ) : (
          <div className="flex h-48 items-center justify-center bg-[#eef6f2] text-sm text-[#5a6b66]">
            Mapa indisponível
          </div>
        )}
        <div className="p-4">
          <p className="text-sm leading-relaxed text-[#5a6b66]">{endereco}</p>
          <button
            type="button"
            onClick={onAbrirMapa}
            className="mt-3 w-full rounded-xl bg-[#1a4a3a] py-2.5 text-sm font-semibold text-white active:opacity-90"
          >
            Abrir no mapa
          </button>
          {mapUrl && (
            <a
              href={mapUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="sr-only"
            >
              Abrir endereço no Google Maps
            </a>
          )}
        </div>
      </div>
    </section>
  );
}
