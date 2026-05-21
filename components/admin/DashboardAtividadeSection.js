"use client";

import Link from "next/link";
import {
  formatLogDateTime,
  formatarAcaoLog,
  formatarDetalhesLog,
  getLogAcaoBadgeAdmin,
} from "@/lib/adminLogs";

/**
 * Timeline full-width de logs recentes.
 * @param {object} props
 * @param {object[]} props.logs
 * @param {object[]} props.perfis
 * @returns {import("react").JSX.Element}
 */
export default function DashboardAtividadeSection({ logs, perfis }) {
  return (
    <section className="rounded-3xl bg-white p-5 shadow-md ring-1 ring-black/5 md:p-6">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <h2 className="text-xl font-bold text-[#1a2e28]">Atividade recente</h2>
        <Link
          href="/admin/logs"
          className="text-sm font-semibold text-[#1a4a3a] underline-offset-2 hover:underline"
        >
          Ver todos os logs →
        </Link>
      </div>

      {logs.length === 0 ? (
        <p className="mt-6 text-sm text-[#5a6b66]">Nenhuma atividade registrada.</p>
      ) : (
        <ul className="relative mt-6 space-y-0 border-l-2 border-[#d4ede8] pl-6">
          {logs.map((log, index) => {
            const perfil = perfis.find((p) => p.id === log.user_id);
            const nome = log.user_nome || perfil?.nome || log.user_email || "Visitante";
            const badge = getLogAcaoBadgeAdmin(log.acao);
            const { relativo, absoluto } = formatLogDateTime(log.created_at);
            const inicial = String(nome).charAt(0).toUpperCase();

            return (
              <li key={log.id} className={`relative ${index > 0 ? "mt-6" : ""}`}>
                <span
                  className="absolute -left-[31px] top-5 flex h-4 w-4 items-center justify-center rounded-full border-2 border-white bg-[#1a4a3a] ring-2 ring-[#d4ede8]"
                  aria-hidden
                />
                <article className="rounded-2xl border border-[#eef3f1] bg-[#fafcfb] p-5 md:p-6">
                  <div className="flex flex-wrap gap-4">
                    <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-[#d4ede8] text-sm font-bold text-[#1a4a3a]">
                      {inicial}
                    </span>
                    <div className="min-w-0 flex-1">
                      <div className="flex flex-wrap items-start justify-between gap-2">
                        <div>
                          <p className="font-bold text-[#1a2e28]">{nome}</p>
                          <p className="mt-0.5 text-sm text-[#5a6b66]">
                            {formatarAcaoLog(log)}
                          </p>
                        </div>
                        <div className="flex shrink-0 flex-col items-end gap-1">
                          <span
                            className={`inline-flex rounded-full px-2.5 py-1 text-xs font-semibold ${badge.className}`}
                          >
                            {badge.label}
                          </span>
                          <time
                            className="text-xs text-[#9aa8a3]"
                            dateTime={log.created_at}
                            title={absoluto}
                          >
                            {relativo}
                          </time>
                        </div>
                      </div>
                      <p className="mt-2 text-sm text-[#5a6b66]">
                        {formatarDetalhesLog(log.detalhes)}
                      </p>
                    </div>
                  </div>
                </article>
              </li>
            );
          })}
        </ul>
      )}
    </section>
  );
}
