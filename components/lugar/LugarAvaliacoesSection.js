"use client";

import {
  formatAvaliacaoDate,
  getDistribuicaoEstrelas,
  getIniciaisAutor,
  getNomeAutorAvaliacao,
  getResumoNotas,
  getSentimentoEmoji,
  parseAspectos,
} from "@/lib/avaliacoes";

/**
 * @param {{ nota: number, className?: string }} props
 * @returns {import("react").JSX.Element}
 */
function EstrelasNota({ nota, className = "" }) {
  return (
    <span className={`inline-flex gap-0.5 ${className}`} aria-label={`${nota} de 5 estrelas`}>
      {[1, 2, 3, 4, 5].map((value) => (
        <span
          key={value}
          className={value <= nota ? "text-amber-400" : "text-gray-200"}
        >
          ★
        </span>
      ))}
    </span>
  );
}

/**
 * @param {object} props
 * @param {Array<object>} props.avaliacoes
 * @returns {import("react").JSX.Element}
 */
function DistribuicaoEstrelas({ avaliacoes }) {
  const dist = getDistribuicaoEstrelas(avaliacoes);
  const max = Math.max(...Object.values(dist), 1);

  return (
    <div className="mt-4 space-y-1.5">
      {[5, 4, 3, 2, 1].map((estrelas) => {
        const count = dist[estrelas] || 0;
        const width = max > 0 ? Math.round((count / max) * 100) : 0;
        return (
          <div key={estrelas} className="flex items-center gap-2 text-xs text-[#5a6b66]">
            <span className="w-6 shrink-0 font-medium">{estrelas}★</span>
            <div className="h-2 flex-1 overflow-hidden rounded-full bg-[#e8eeee]">
              <div
                className="h-full rounded-full bg-amber-400 transition-all"
                style={{ width: `${width}%` }}
              />
            </div>
            <span className="w-6 shrink-0 text-right tabular-nums">{count}</span>
          </div>
        );
      })}
    </div>
  );
}

/**
 * @param {object} props
 * @param {object} props.avaliacao
 * @returns {import("react").JSX.Element}
 */
function AvaliacaoCard({ avaliacao }) {
  const nome = getNomeAutorAvaliacao(avaliacao);
  const fotoUrl = avaliacao.perfis?.foto_url;
  const aspectos = parseAspectos(avaliacao.aspectos);
  const visiveis = aspectos.slice(0, 3);
  const extras = aspectos.length - visiveis.length;

  return (
    <article className="rounded-2xl bg-white p-4 shadow-sm ring-1 ring-[#e8eeee]">
      <div className="flex items-start gap-3">
        {fotoUrl ? (
          <img
            src={fotoUrl}
            alt=""
            className="h-10 w-10 shrink-0 rounded-full object-cover"
          />
        ) : (
          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-[#d4ede8] text-sm font-bold text-[#1a4a3a]">
            {getIniciaisAutor(nome)}
          </div>
        )}
        <div className="min-w-0 flex-1">
          <div className="flex items-start justify-between gap-2">
            <div>
              <p className="text-sm font-semibold text-[#1a2e28]">{nome}</p>
              <EstrelasNota nota={Number(avaliacao.nota) || 0} className="mt-0.5 text-sm" />
            </div>
            <span
              className="shrink-0 text-base"
              title={avaliacao.sentimento || "neutro"}
              aria-hidden
            >
              {getSentimentoEmoji(avaliacao.sentimento)}
            </span>
          </div>
          <p className="mt-0.5 text-xs text-[#9aa8a3]">
            {formatAvaliacaoDate(avaliacao.created_at)}
          </p>
        </div>
      </div>

      {visiveis.length > 0 && (
        <div className="mt-3 flex flex-wrap gap-1.5">
          {visiveis.map((aspecto) => (
            <span
              key={aspecto}
              className="rounded-full bg-gray-100 px-2.5 py-0.5 text-xs font-medium text-gray-700"
            >
              {aspecto}
            </span>
          ))}
          {extras > 0 && (
            <span className="rounded-full bg-gray-100 px-2.5 py-0.5 text-xs font-medium text-gray-500">
              e mais {extras}
            </span>
          )}
        </div>
      )}

      {avaliacao.comentario?.trim() && (
        <p className="mt-3 text-sm leading-relaxed text-[#5a6b66]">
          {avaliacao.comentario}
        </p>
      )}
    </article>
  );
}

/**
 * Seção de avaliações aprovadas na página do lugar.
 * @param {object} props
 * @param {Array<object>} props.avaliacoes
 * @param {boolean} props.jaAvaliou
 * @param {() => void} props.onAvaliar
 * @param {string} [props.toast]
 * @returns {import("react").JSX.Element}
 */
export default function LugarAvaliacoesSection({
  avaliacoes,
  jaAvaliou,
  onAvaliar,
  toast = "",
}) {
  const { media, total } = getResumoNotas(avaliacoes);

  return (
    <section className="mt-8">
      <div className="flex items-center justify-between gap-3">
        <h2 className="text-sm font-bold text-[#1a2e28]">Avaliações</h2>
        {!jaAvaliou && (
          <button
            type="button"
            onClick={onAvaliar}
            className="shrink-0 rounded-full bg-[#1a4a3a] px-4 py-2 text-xs font-semibold text-white"
          >
            Avaliar
          </button>
        )}
      </div>

      {toast && (
        <p
          className="mt-3 rounded-xl bg-[#d4ede8] px-3 py-2.5 text-sm text-[#1a4a3a]"
          role="status"
        >
          {toast}
        </p>
      )}

      {total === 0 ? (
        <p className="mt-4 text-sm text-[#9aa8a3]">
          Seja o primeiro a avaliar este lugar
        </p>
      ) : (
        <>
          <div className="mt-4 rounded-2xl bg-white p-4 shadow-sm ring-1 ring-[#e8eeee]">
            <div className="flex items-end gap-4">
              <p className="text-4xl font-bold text-[#1a2e28]">
                {media.toFixed(1)}
              </p>
              <div>
                <EstrelasNota nota={Math.round(media)} className="text-lg" />
                <p className="mt-0.5 text-xs text-[#9aa8a3]">
                  {total} {total === 1 ? "avaliação" : "avaliações"}
                </p>
              </div>
            </div>
            <DistribuicaoEstrelas avaliacoes={avaliacoes} />
          </div>

          <ul className="mt-4 space-y-3">
            {avaliacoes.map((avaliacao) => (
              <li key={avaliacao.id}>
                <AvaliacaoCard avaliacao={avaliacao} />
              </li>
            ))}
          </ul>
        </>
      )}
    </section>
  );
}
