"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import { getBadgeParceiroLabel } from "@/lib/lugarBadges";
import {
  countRoteiroParadas,
  getRoteiroResumo,
  parseRoteiroMarkdown,
} from "@/lib/roteiroParse";

/**
 * @param {string} text
 * @returns {string}
 */
function stripMarkdownBold(text) {
  return String(text || "").replace(/\*\*/g, "").trim();
}

/**
 * Parada individual na timeline do roteiro.
 * @param {object} props
 * @param {import("@/lib/roteiroParse").RoteiroParada} props.parada
 * @param {boolean} props.isLast
 * @param {boolean} [props.ehParceiro]
 * @returns {import("react").JSX.Element}
 */
function RoteiroParadaItem({ parada, isLast, ehParceiro = false }) {
  const atividades = (parada.atividades ?? []).filter(Boolean);

  return (
    <li className="relative flex gap-3 pb-4 last:pb-0">
      {!isLast && (
        <span
          className="absolute left-[15px] top-8 bottom-0 w-px bg-[#d4ede8]"
          aria-hidden
        />
      )}
      <div
        className="relative z-[1] flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-[#1a4a3a] text-xs font-bold text-white"
        aria-hidden
      >
        {parada.ordem}
      </div>
      <div className="min-w-0 flex-1 pt-0.5">
        <div className="flex flex-wrap items-start justify-between gap-2">
          <div className="min-w-0 flex-1">
            <h4 className="text-base font-bold leading-snug text-[#1a2e28]">
              {stripMarkdownBold(parada.nome)}
            </h4>
            {ehParceiro ? (
              <span className="mt-1 inline-flex rounded-full bg-amber-100 px-2 py-0.5 text-[10px] font-bold text-amber-900">
                {getBadgeParceiroLabel()}
              </span>
            ) : null}
          </div>
          {parada.duracao ? (
            <span className="inline-flex shrink-0 items-center gap-1 rounded-full bg-[#f0f4f3] px-2 py-0.5 text-[11px] font-semibold text-[#5a6b66] ring-1 ring-[#e3e9e6]">
              <span aria-hidden>⏱</span>
              {stripMarkdownBold(parada.duracao)}
            </span>
          ) : null}
        </div>

        {atividades.length > 0 ? (
          <ul className="mt-2 space-y-1.5">
            {atividades.map((item) => (
              <li
                key={`${parada.ordem}-${item.slice(0, 40)}`}
                className="flex gap-2 text-sm leading-relaxed text-[#3d4f4a]"
              >
                <span className="shrink-0 font-bold text-[#1a4a3a]" aria-hidden>
                  →
                </span>
                <span>{stripMarkdownBold(item)}</span>
              </li>
            ))}
          </ul>
        ) : null}

        {parada.dica ? (
          <p className="mt-2 text-sm leading-relaxed text-[#5a6b66]">
            <span className="font-semibold text-[#1a4a3a]">Dica:</span>{" "}
            {stripMarkdownBold(parada.dica)}
          </p>
        ) : null}

        {parada.lugarId ? (
          <Link
            href={`/lugares/${parada.lugarId}`}
            className="mt-2 inline-flex text-sm font-semibold text-[#1a4a3a] underline-offset-2 hover:underline"
          >
            Ver no guia →
          </Link>
        ) : null}
      </div>
    </li>
  );
}

/**
 * Bloco de período (manhã/tarde/noite) com paradas.
 * @param {object} props
 * @param {import("@/lib/roteiroParse").RoteiroPeriodo} props.periodo
 * @param {Map<string, boolean>} [props.parceiroPorLugarId]
 * @returns {import("react").JSX.Element|null}
 */
function RoteiroPeriodoBlock({ periodo, parceiroPorLugarId }) {
  if (!periodo.paradas?.length) return null;

  return (
    <div className="mt-3 first:mt-0">
      <div className="flex items-center gap-2 rounded-lg bg-[#f0f4f3] px-3 py-2">
        <span className="text-base leading-none" aria-hidden>
          {periodo.emoji}
        </span>
        <h3 className="text-xs font-bold uppercase tracking-wide text-[#1a4a3a]">
          {periodo.label}
        </h3>
      </div>
      <ol className="mt-2 list-none p-0">
        {periodo.paradas.map((parada, index) => (
          <RoteiroParadaItem
            key={`${periodo.id}-${parada.ordem}-${parada.nome}`}
            parada={parada}
            isLast={index === periodo.paradas.length - 1}
            ehParceiro={Boolean(
              parada.lugarId && parceiroPorLugarId?.get(String(parada.lugarId))
            )}
          />
        ))}
      </ol>
    </div>
  );
}

/**
 * Accordion de um dia do roteiro.
 * @param {object} props
 * @param {import("@/lib/roteiroParse").RoteiroDia} props.dia
 * @param {boolean} props.defaultOpen
 * @param {Map<string, boolean>} [props.parceiroPorLugarId]
 * @returns {import("react").JSX.Element}
 */
function RoteiroDiaAccordion({ dia, defaultOpen, parceiroPorLugarId }) {
  const [open, setOpen] = useState(defaultOpen);

  const paradasNoDia =
    dia.periodos.reduce((acc, p) => acc + p.paradas.length, 0) +
    dia.paradasSemPeriodo.length;

  return (
    <section className="overflow-hidden rounded-2xl border border-[#e3e9e6] bg-white shadow-sm">
      <button
        type="button"
        onClick={() => setOpen((value) => !value)}
        className="flex w-full items-center justify-between gap-3 px-4 py-3.5 text-left transition-colors hover:bg-[#f7fbf9]"
        aria-expanded={open}
      >
        <div className="min-w-0">
          <p className="text-[10px] font-bold uppercase tracking-wider text-[#1a4a3a]">
            Dia {dia.numero}
          </p>
          <h3 className="font-display text-base font-extrabold leading-snug text-[#1a2e28]">
            {stripMarkdownBold(dia.titulo.replace(/^dia\s*\d+\s*[—–-]?\s*/i, "")) ||
              dia.titulo}
          </h3>
        </div>
        <div className="flex shrink-0 items-center gap-2">
          <span className="rounded-full bg-[#d4ede8] px-2.5 py-1 text-[11px] font-bold text-[#1a4a3a]">
            {paradasNoDia} {paradasNoDia === 1 ? "parada" : "paradas"}
          </span>
          <span
            className={`text-[#1a4a3a] transition-transform ${open ? "rotate-180" : ""}`}
            aria-hidden
          >
            ▾
          </span>
        </div>
      </button>

      {open && (
        <div className="border-t border-[#e8eeee] px-4 pb-4 pt-1">
          {dia.periodos.map((periodo) => (
            <RoteiroPeriodoBlock
              key={periodo.id ?? periodo.label}
              periodo={periodo}
              parceiroPorLugarId={parceiroPorLugarId}
            />
          ))}
          {dia.paradasSemPeriodo.length > 0 ? (
            <ol className="mt-3 list-none p-0">
              {dia.paradasSemPeriodo.map((parada, index) => (
                <RoteiroParadaItem
                  key={`sem-periodo-${parada.ordem}-${parada.nome}`}
                  parada={parada}
                  isLast={index === dia.paradasSemPeriodo.length - 1}
                  ehParceiro={Boolean(
                    parada.lugarId && parceiroPorLugarId?.get(String(parada.lugarId))
                  )}
                />
              ))}
            </ol>
          ) : null}
        </div>
      )}
    </section>
  );
}

/**
 * Timeline compacta do roteiro gerado ou salvo.
 * @param {object} props
 * @param {string} props.conteudo - Markdown do roteiro.
 * @param {string} [props.titulo]
 * @param {string} [props.diasLabel]
 * @param {string} [props.perfil]
 * @param {string[]} [props.interesses]
 * @param {Array<{ id: string, nome: string }>} [props.lugaresCatalog]
 * @param {boolean} [props.compactHeader=false] - Omitir header interno (pai já exibe título).
 * @returns {import("react").JSX.Element}
 */
export default function RoteiroItineraryView({
  conteudo,
  titulo = "",
  diasLabel = "",
  perfil = "",
  interesses = [],
  lugaresCatalog = [],
  compactHeader = false,
  className = "",
}) {
  const parsed = useMemo(
    () => parseRoteiroMarkdown(conteudo, lugaresCatalog),
    [conteudo, lugaresCatalog]
  );

  const parceiroPorLugarId = useMemo(() => {
    const map = new Map();
    for (const item of lugaresCatalog ?? []) {
      if (item?.id) {
        map.set(String(item.id), Boolean(item.ehParceiro));
      }
    }
    return map;
  }, [lugaresCatalog]);

  const resumo = getRoteiroResumo(parsed);
  const totalParadas = countRoteiroParadas(parsed);

  if (!conteudo?.trim()) {
    return (
      <div className="rounded-2xl border border-dashed border-[#d4ede8] bg-[#f7fbf9] px-4 py-8 text-center">
        <p className="text-sm font-medium text-[#1a2e28]">
          Não foi possível montar o roteiro desta vez.
        </p>
        <p className="mt-1 text-sm text-[#5a6b66]">Tente gerar novamente.</p>
      </div>
    );
  }

  if (parsed.fallbackTexto && parsed.intro.length > 0) {
    return (
      <div className="space-y-3">
        {!compactHeader && titulo ? (
          <header>
            <h2 className="font-display text-lg font-extrabold text-[#1a2e28]">
              {titulo}
            </h2>
          </header>
        ) : null}
        <div className="rounded-2xl bg-white p-4 text-sm leading-relaxed text-[#3d4f4a] shadow-sm ring-1 ring-[#e8eeee]">
          {parsed.intro.map((line) => (
            <p key={line.slice(0, 48)} className="mb-2 last:mb-0">
              {stripMarkdownBold(line)}
            </p>
          ))}
        </div>
      </div>
    );
  }

  if (parsed.dias.length === 0) {
    return (
      <div className="rounded-2xl border border-dashed border-[#d4ede8] bg-[#f7fbf9] px-4 py-8 text-center">
        <p className="text-sm font-medium text-[#1a2e28]">
          Roteiro sem paradas estruturadas.
        </p>
        <p className="mt-1 text-sm text-[#5a6b66]">Gere novamente para reorganizar.</p>
      </div>
    );
  }

  const chips = [
    diasLabel,
    perfil,
    ...(interesses?.length ? [interesses.slice(0, 3).join(" · ")] : []),
  ].filter(Boolean);

  return (
    <div className={`space-y-4 ${className}`.trim()}>
      {!compactHeader ? (
        <header className="space-y-2">
          {titulo ? (
            <h2 className="font-display text-lg font-extrabold leading-tight text-[#1a2e28]">
              {titulo}
            </h2>
          ) : null}
          {chips.length > 0 ? (
            <div className="flex flex-wrap gap-1.5">
              {chips.map((chip) => (
                <span
                  key={chip}
                  className="rounded-full bg-[#d4ede8] px-2.5 py-1 text-[11px] font-semibold text-[#1a4a3a]"
                >
                  {chip}
                </span>
              ))}
            </div>
          ) : null}
          {resumo ? (
            <p className="text-xs text-[#5a6b66]">
              {resumo}
              {totalParadas > 0 ? " · Siga na ordem abaixo" : ""}
            </p>
          ) : null}
        </header>
      ) : null}

      {parsed.intro.length > 0 ? (
        <div className="rounded-xl bg-[#f0f4f3] px-3 py-2.5 text-sm leading-relaxed text-[#3d4f4a]">
          {parsed.intro.map((line) => (
            <p key={line.slice(0, 48)}>{stripMarkdownBold(line)}</p>
          ))}
        </div>
      ) : null}

      <div className="space-y-3" role="list" aria-label="Dias do roteiro">
        {parsed.dias.map((dia, index) => (
          <RoteiroDiaAccordion
            key={`dia-${dia.numero}-${dia.titulo}`}
            dia={dia}
            defaultOpen={index === 0 || parsed.dias.length === 1}
            parceiroPorLugarId={parceiroPorLugarId}
          />
        ))}
      </div>
    </div>
  );
}
