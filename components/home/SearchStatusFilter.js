"use client";

import { FILTRO_STATUS_BUSCA } from "@/lib/busca";

const OPCOES = [
  { id: FILTRO_STATUS_BUSCA.TODOS, label: "Todos" },
  { id: FILTRO_STATUS_BUSCA.ABERTOS, label: "Abertos agora" },
  { id: FILTRO_STATUS_BUSCA.FECHADOS, label: "Fechados" },
];

export default function SearchStatusFilter({ value, onChange }) {
  return (
    <div className="mb-2 flex gap-1.5">
      {OPCOES.map((opcao) => {
        const selected = value === opcao.id;

        return (
          <button
            key={opcao.id}
            type="button"
            onClick={() => onChange(opcao.id)}
            className={`rounded-full px-2.5 py-1 text-[11px] font-semibold transition-colors ${
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
