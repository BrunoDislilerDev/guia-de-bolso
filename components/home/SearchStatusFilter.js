"use client";

import { FILTRO_STATUS_BUSCA } from "@/lib/busca";

const OPCOES = [
  { id: FILTRO_STATUS_BUSCA.TODOS, label: "Todos" },
  { id: FILTRO_STATUS_BUSCA.ABERTOS, label: "Abertos agora" },
  { id: FILTRO_STATUS_BUSCA.FECHADOS, label: "Fechados" },
];

export default function SearchStatusFilter({ value, onChange }) {
  return (
    <div className="mb-4 flex gap-2 overflow-x-auto pb-1 scrollbar-hide [&::-webkit-scrollbar]:hidden">
      {OPCOES.map((opcao) => {
        const selected = value === opcao.id;

        return (
          <button
            key={opcao.id}
            type="button"
            onClick={() => onChange(opcao.id)}
            className={`shrink-0 rounded-full px-3.5 py-2 text-xs font-semibold transition-colors ${
              selected
                ? "bg-[#1a4a3a] text-white"
                : "bg-white text-[#1a4a3a] ring-1 ring-[#e3e9e6] hover:bg-[#f7faf9]"
            }`}
          >
            {opcao.label}
          </button>
        );
      })}
    </div>
  );
}
