"use client";

/**
 * Renderiza cinco estrelas preenchidas conforme a nota (arredondada).
 * @param {object} props
 * @param {number} props.value - Nota de 0 a 5.
 * @param {string} [props.className] - Classes de tamanho/cor do texto.
 * @returns {import("react").JSX.Element}
 */
function Stars({ value, className = "text-lg" }) {
  const rounded = Math.round(Number(value) || 0);
  return (
    <span className={`tracking-tight text-[#e8a838] ${className}`}>
      {"★".repeat(rounded)}
      <span className="text-[#d8dfdc]">{"★".repeat(5 - rounded)}</span>
    </span>
  );
}

/**
 * Formata data de avaliação para exibição em pt-BR (ex.: "19 mai 2026").
 * @param {string|number|Date} value - ISO ou timestamp da avaliação.
 * @returns {string} Data formatada ou string vazia se inválida.
 */
function formatReviewDate(value) {
  if (!value) return "";
  return new Intl.DateTimeFormat("pt-BR", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  })
    .format(new Date(value))
    .replace(".", "");
}

/**
 * Seção de avaliações com resumo, até três reviews e CTA para avaliar.
 * @param {object} props
 * @param {Array<{ id: string, nota: number, comentario?: string, created_at?: string, perfis?: object }>} props.avaliacoes - Avaliações aprovadas.
 * @param {number} props.mediaAvaliacoes - Média das notas.
 * @param {number} props.totalAvaliacoes - Total de avaliações.
 * @param {{ percentRecomenda: number, melhorPara: string[] }} [props.resumo] - Bloco de insights agregados.
 * @param {(avaliacao: object) => string} props.getReviewerName - Resolve o nome exibido do autor.
 * @param {boolean} props.jaAvaliou - Desabilita o botão se o usuário já avaliou.
 * @param {() => void} props.onAvaliar - Abre fluxo/modal de nova avaliação.
 * @returns {import("react").JSX.Element}
 */
export default function LugarAvaliacoesSection({
  avaliacoes,
  mediaAvaliacoes,
  totalAvaliacoes,
  resumo,
  getReviewerName,
  jaAvaliou,
  onAvaliar,
}) {
  return (
    <section className="mt-7">
      <h2 className="mb-3 text-sm font-bold text-[#1a2e28]">Avaliações</h2>

      <div className="rounded-2xl bg-white p-4 shadow-sm ring-1 ring-[#e8eeee]">
        {resumo && (
          <div className="mb-4 rounded-xl bg-[#f0f7f4] px-4 py-3">
            <p className="text-sm font-bold text-[#1a4a3a]">
              {resumo.percentRecomenda}% das pessoas recomendam
            </p>
            <p className="mt-1 text-xs text-[#5a6b66]">
              Melhor para:{" "}
              <span className="font-semibold text-[#1a2e28]">
                {resumo.melhorPara.join(", ")}
              </span>
            </p>
            {totalAvaliacoes > 0 && (
              <div className="mt-2 flex items-center gap-2">
                <Stars value={mediaAvaliacoes} className="text-base" />
                <span className="text-xs text-[#5a6b66]">
                  {mediaAvaliacoes.toFixed(1)} · {totalAvaliacoes} avaliações
                </span>
              </div>
            )}
          </div>
        )}

        {totalAvaliacoes > 0 ? (
          <div className="grid gap-4">
            {avaliacoes.slice(0, 3).map((avaliacao) => {
              const name = getReviewerName(avaliacao);
              return (
                <article
                  key={avaliacao.id}
                  className="border-t border-[#eef3f1] pt-4 first:border-0 first:pt-0"
                >
                  <div className="flex items-start gap-3">
                    <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-[#d4ede8] text-sm font-bold text-[#1a4a3a]">
                      {name.charAt(0).toUpperCase()}
                    </div>
                    <div className="min-w-0 flex-1">
                      <div className="flex items-start justify-between gap-2">
                        <div>
                          <h3 className="text-sm font-bold text-[#1a2e28]">
                            {name}
                          </h3>
                          <Stars value={avaliacao.nota} className="text-sm" />
                        </div>
                        <span className="shrink-0 text-xs text-[#9aa8a3]">
                          {formatReviewDate(avaliacao.created_at)}
                        </span>
                      </div>
                      {avaliacao.comentario && (
                        <p className="mt-2 text-sm leading-relaxed text-[#5a6b66]">
                          {avaliacao.comentario}
                        </p>
                      )}
                    </div>
                  </div>
                </article>
              );
            })}
          </div>
        ) : (
          <p className="text-sm text-[#5a6b66]">Seja o primeiro a avaliar</p>
        )}

        <button
          type="button"
          onClick={onAvaliar}
          disabled={jaAvaliou}
          className={`mt-5 w-full rounded-xl py-3 text-sm font-semibold transition-colors ${
            jaAvaliou
              ? "bg-zinc-100 text-zinc-500"
              : "bg-[#1a4a3a] text-white active:opacity-90"
          }`}
        >
          {jaAvaliou ? "Você já avaliou este lugar" : "Avaliar este lugar"}
        </button>
      </div>
    </section>
  );
}
