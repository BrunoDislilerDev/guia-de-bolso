"use client";

import { useState } from "react";
import LoginModal from "@/components/LoginModal";
import RoteiroBottomSheet from "@/components/RoteiroBottomSheet";
import { formatRoteiroConteudo } from "@/lib/roteiroMarkdown";

function formatData(iso) {
  if (!iso) return "";
  return new Intl.DateTimeFormat("pt-BR", {
    day: "2-digit",
    month: "short",
    year: "numeric",
    timeZone: "America/Sao_Paulo",
  }).format(new Date(iso));
}

function RoteiroViewModal({ roteiro, onClose }) {
  if (!roteiro) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-end bg-black/55 backdrop-blur-sm sm:items-center sm:justify-center sm:p-4"
      onClick={onClose}
    >
      <div
        className="flex max-h-[90vh] w-full flex-col rounded-t-[24px] bg-white shadow-2xl sm:max-w-lg sm:rounded-3xl"
        onClick={(event) => event.stopPropagation()}
        role="dialog"
        aria-modal="true"
      >
        <div className="border-b border-gray-100 px-5 py-4">
          <h2 className="text-lg font-bold text-gray-950">{roteiro.titulo}</h2>
          <p className="mt-1 text-xs text-gray-500">{formatData(roteiro.created_at)}</p>
        </div>
        <div className="flex-1 overflow-y-auto px-5 py-4">
          <div
            className="text-sm leading-relaxed text-gray-700"
            dangerouslySetInnerHTML={{
              __html: formatRoteiroConteudo(roteiro.conteudo),
            }}
          />
        </div>
        <div className="border-t border-gray-100 px-5 py-4">
          <button
            type="button"
            onClick={onClose}
            className="w-full rounded-xl bg-[#1a4a3a] py-3 text-sm font-semibold text-white"
          >
            Fechar
          </button>
        </div>
      </div>
    </div>
  );
}

export default function RoteiroSection({ isLoggedIn, roteirosIniciais = [] }) {
  const [sheetOpen, setSheetOpen] = useState(false);
  const [loginOpen, setLoginOpen] = useState(false);
  const [roteiros, setRoteiros] = useState(roteirosIniciais);
  const [roteiroVisualizando, setRoteiroVisualizando] = useState(null);

  function handleRoteiroSalvo(novoRoteiro) {
    if (!novoRoteiro) return;
    setRoteiros((atual) => [
      novoRoteiro,
      ...atual.filter((item) => item.id !== novoRoteiro.id),
    ]);
  }

  return (
    <>
      <section className="mb-6 overflow-hidden rounded-3xl bg-gradient-to-br from-gray-900 to-emerald-900 p-5 text-white shadow-sm">
        <span className="text-2xl" aria-hidden>
          ✨
        </span>
        <h2 className="mt-2 text-xl font-bold leading-tight">Roteiro personalizado com IA</h2>
        <p className="mt-1 text-sm text-emerald-100/90">
          Monte seu roteiro ideal em segundos
        </p>
        <button
          type="button"
          onClick={() => setSheetOpen(true)}
          className="mt-4 w-full rounded-xl bg-white py-3 text-sm font-semibold text-emerald-900 transition-colors hover:bg-emerald-50"
        >
          Criar roteiro
        </button>
      </section>

      {isLoggedIn && roteiros.length > 0 && (
        <section className="mb-6">
          <h2 className="mb-3 text-lg font-bold text-gray-950">Meus roteiros</h2>
          <div className="grid gap-3">
            {roteiros.map((roteiro) => (
              <article
                key={roteiro.id ?? roteiro.created_at}
                className="flex items-center justify-between gap-3 rounded-2xl bg-white p-4 shadow-sm"
              >
                <div className="min-w-0 flex-1">
                  <h3 className="truncate font-semibold text-gray-950">{roteiro.titulo}</h3>
                  <p className="mt-0.5 text-xs text-gray-500">{formatData(roteiro.created_at)}</p>
                </div>
                <button
                  type="button"
                  onClick={() => setRoteiroVisualizando(roteiro)}
                  className="shrink-0 rounded-full bg-emerald-700 px-4 py-2 text-sm font-semibold text-white transition-colors hover:bg-emerald-800"
                >
                  Ver
                </button>
              </article>
            ))}
          </div>
        </section>
      )}

      <RoteiroBottomSheet
        isOpen={sheetOpen}
        onClose={() => setSheetOpen(false)}
        isLoggedIn={isLoggedIn}
        onLoginRequired={() => setLoginOpen(true)}
        onRoteiroSalvo={handleRoteiroSalvo}
      />

      <LoginModal
        isOpen={loginOpen}
        motivo="rotas"
        onClose={() => setLoginOpen(false)}
      />

      <RoteiroViewModal
        roteiro={roteiroVisualizando}
        onClose={() => setRoteiroVisualizando(null)}
      />
    </>
  );
}
