"use client";

import { useEffect, useState } from "react";
import AdminShell, { useAdminAuth } from "@/components/admin/AdminShell";
import { createClient } from "@/lib/supabase";

const tabs = ["pendente", "aprovada", "rejeitada"];

function Stars({ value }) {
  const nota = Number(value) || 0;
  return (
    <span className="text-[#e8a838]">
      {"★".repeat(nota)}
      <span className="text-zinc-300">{"★".repeat(5 - nota)}</span>
    </span>
  );
}

function formatDate(value) {
  if (!value) return "";
  return new Intl.DateTimeFormat("pt-BR", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  }).format(new Date(value));
}

export default function AdminAvaliacoesPage() {
  const { loading } = useAdminAuth();
  const [activeTab, setActiveTab] = useState("pendente");
  const [avaliacoes, setAvaliacoes] = useState([]);

  useEffect(() => {
    if (!loading) loadAvaliacoes(activeTab);
  }, [loading, activeTab]);

  async function loadAvaliacoes(status) {
    const supabase = createClient();
    const { data, error } = await supabase
      .from("avaliacoes")
      .select("*, lugares(nome), profiles:user_id(full_name,nome)")
      .eq("status", status)
      .order("created_at", { ascending: false });

    if (!error) {
      setAvaliacoes(data ?? []);
      return;
    }

    const fallback = await supabase
      .from("avaliacoes")
      .select("*")
      .eq("status", status)
      .order("created_at", { ascending: false });
    setAvaliacoes(fallback.data ?? []);
  }

  async function updateStatus(id, status) {
    const supabase = createClient();
    await supabase.from("avaliacoes").update({ status }).eq("id", id);
    setAvaliacoes((items) => items.filter((item) => item.id !== id));
  }

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-[#f0f4f3] text-[#5a6b66]">
        Carregando admin...
      </div>
    );
  }

  return (
    <AdminShell title="Avaliações">
      <div className="mb-5 flex gap-2">
        {tabs.map((tab) => (
          <button
            key={tab}
            type="button"
            onClick={() => setActiveTab(tab)}
            className={`rounded-full px-4 py-2 text-sm font-semibold capitalize ${
              activeTab === tab
                ? "bg-[#1a4a3a] text-white"
                : "bg-white text-[#1a4a3a]"
            }`}
          >
            {tab}s
          </button>
        ))}
      </div>

      <div className="grid gap-4">
        {avaliacoes.length === 0 ? (
          <p className="rounded-2xl bg-white p-5 text-sm text-[#5a6b66] shadow-sm">
            Nenhuma avaliação nessa aba.
          </p>
        ) : (
          avaliacoes.map((avaliacao) => (
            <article key={avaliacao.id} className="rounded-2xl bg-white p-5 shadow-sm">
              <div className="flex flex-col gap-3 md:flex-row md:items-start md:justify-between">
                <div>
                  <p className="font-bold text-[#1a2e28]">
                    {avaliacao.lugares?.nome || "Lugar"}
                  </p>
                  <p className="text-sm text-[#5a6b66]">
                    {avaliacao.profiles?.full_name ||
                      avaliacao.profiles?.nome ||
                      "Usuário anônimo"}{" "}
                    · {formatDate(avaliacao.created_at)}
                  </p>
                  <Stars value={avaliacao.nota} />
                  <p className="mt-2 text-sm leading-relaxed text-[#5a6b66]">
                    {avaliacao.comentario || "Sem comentário"}
                  </p>
                </div>

                {activeTab === "pendente" && (
                  <div className="flex gap-2">
                    <button
                      type="button"
                      onClick={() => updateStatus(avaliacao.id, "aprovada")}
                      className="rounded-lg bg-[#1a4a3a] px-3 py-2 text-sm font-semibold text-white"
                    >
                      Aprovar
                    </button>
                    <button
                      type="button"
                      onClick={() => updateStatus(avaliacao.id, "rejeitada")}
                      className="rounded-lg bg-[#d9534f] px-3 py-2 text-sm font-semibold text-white"
                    >
                      Rejeitar
                    </button>
                  </div>
                )}
              </div>
            </article>
          ))
        )}
      </div>
    </AdminShell>
  );
}
