"use client";

/**
 * Seção de localização com mapa estático, endereço e CTA para abrir no app de mapas.
 * @param {object} props
 * @param {string} props.endereco - Endereço formatado para exibição.
 * @param {string} [props.mapUrl] - URL do Google Maps (link acessível oculto).
 * @param {string} [props.staticMapSrc] - URL da imagem do mapa estático.
 * @param {string} props.nome - Nome do lugar (texto alternativo do mapa).
 * @param {() => void} props.onAbrirMapa - Abre o mapa no app preferido do usuário.
 * @returns {import("react").JSX.Element}
 */
export default function LugarLocalizacaoCard({
  nome,
  endereco,
  mapUrl,
  staticMapSrc,
  onAbrirMapa,
}) {
  return (
    <section className="mt-5">
      <h2 className="mb-3 text-sm font-bold text-[#1a2e28]">Localização</h2>
      <div className="overflow-hidden rounded-2xl bg-white shadow-sm ring-1 ring-[#e8eeee]">
        {staticMapSrc ? (
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
              className="h-36 w-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/25 to-transparent" />
          </button>
        ) : (
          <div className="flex h-28 items-center justify-center bg-[#eef6f2] text-sm text-[#5a6b66]">
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
