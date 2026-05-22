"use client";

import PlaceCard from "@/components/PlaceCard";
import PlaceCardSkeleton from "@/components/home/PlaceCardSkeleton";
import UserErrorAlert from "@/components/UserErrorAlert";

/**
 * IconSearchLarge - Large search icon for empty results state.
 * @param {object} props
 * @param {string} [props.className]
 * @returns {import('react').ReactElement}
 */
function IconSearchLarge({ className = "h-16 w-16" }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="currentColor" aria-hidden>
      <path d="M15.5 14h-.79l-.28-.27A6.471 6.471 0 0016 9.5 6.5 6.5 0 109.5 16 6.5 6.5 0 0016 9.5c0 1.61-.59 3.09-1.57 4.23l.27.28v.79l5 4.99L20.49 19l-4.99-5zm-6 0C7.01 14 5 11.99 5 9.5S7.01 5 9.5 5 14 7.01 14 9.5 11.99 14 9.5 14z" />
    </svg>
  );
}

const SUGESTOES = ["Praias", "Restaurantes", "Trilhas"];

/**
 * SearchResultsPanel - AI search results with loading, empty, and card states.
 * @param {object} props
 * @param {string} props.termo - Search query displayed in the header.
 * @param {boolean} props.loading - Whether results are loading.
 * @param {object[]} [props.resultados] - Matching place records.
 * @param {string} [props.erro] - Optional message (error or info).
 * @param {boolean} [props.erroReportavel] - Use UserErrorAlert with report hint.
 * @param {object} [props.erroReportContext] - Context for feedback sheet.
 * @param {(sugestao: string) => void} props.onSugestaoClick - Called when an empty-state suggestion is tapped.
 * @param {(lugar: object) => boolean} props.isFavorito - Returns whether a place is favorited.
 * @param {(lugar: object) => void} props.onFavoritar - Favorite toggle handler.
 * @returns {import('react').ReactElement}
 */
export default function SearchResultsPanel({
  termo,
  loading,
  resultados = [],
  erro = "",
  erroReportavel = false,
  erroReportContext = null,
  onSugestaoClick,
  isFavorito,
  onFavoritar,
}) {
  return (
    <div className="pb-6">
      {erro && erroReportavel ? (
        <UserErrorAlert
          className="mb-4"
          message={erro}
          reportContext={erroReportContext}
        />
      ) : null}
      {erro && !erroReportavel ? (
        <p className="mb-4 rounded-xl bg-amber-50 px-3 py-2 text-sm text-amber-900">
          {erro}
        </p>
      ) : null}
      <div className="mb-5 flex items-start justify-between gap-3">
        <h2 className="text-lg font-bold text-[#1a2e28]">
          Resultados para &ldquo;{termo}&rdquo;
        </h2>
      </div>

      {loading ? (
        <div className="grid gap-4">
          {[0, 1, 2].map((item) => (
            <PlaceCardSkeleton key={item} />
          ))}
        </div>
      ) : resultados.length === 0 ? (
        <div className="flex flex-col items-center px-4 py-10 text-center">
          <IconSearchLarge className="text-[#c5d5cf]" />
          <p className="mt-4 text-lg font-bold text-[#1a2e28]">
            Nenhum resultado para &ldquo;{termo}&rdquo;
          </p>
          <p className="mt-2 max-w-xs text-sm text-[#5a6b66]">
            Tente buscar por categoria, tipo de lugar ou experiência
          </p>
          <div className="mt-6 flex flex-wrap justify-center gap-2">
            {SUGESTOES.map((sugestao) => (
              <button
                key={sugestao}
                type="button"
                onClick={() => onSugestaoClick(sugestao)}
                className="rounded-full bg-white px-4 py-2 text-sm font-semibold text-[#1a4a3a] shadow-sm ring-1 ring-[#e3e9e6] transition-colors hover:bg-[#f7faf9]"
              >
                {sugestao}
              </button>
            ))}
          </div>
        </div>
      ) : (
        <div className="grid gap-4">
          {resultados.map((lugar) => (
            <PlaceCard
              key={lugar.id}
              lugar={lugar}
              isFavorito={isFavorito(lugar)}
              onFavoritar={onFavoritar}
            />
          ))}
        </div>
      )}
    </div>
  );
}
