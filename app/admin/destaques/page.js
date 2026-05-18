"use client";

import { useEffect, useState } from "react";
import AdminShell, { useAdminAuth } from "@/components/admin/AdminShell";
import { createClient } from "@/lib/supabase";

export default function AdminDestaquesPage() {
  const { loading } = useAdminAuth();
  const [destaques, setDestaques] = useState([]);
  const [lugares, setLugares] = useState([]);
  const [form, setForm] = useState({
    lugar_id: "",
    data_inicio: "",
    data_fim: "",
    ativo: true,
  });

  useEffect(() => {
    if (!loading) {
      loadData();
    }
  }, [loading]);

  async function loadData() {
    const supabase = createClient();
    const [destaquesRes, lugaresRes] = await Promise.all([
      supabase
        .from("destaques")
        .select("*, lugares(nome)")
        .order("data_inicio", { ascending: false }),
      supabase.from("lugares").select("id,nome").order("nome"),
    ]);

    if (!destaquesRes.error) {
      setDestaques(destaquesRes.data ?? []);
    } else {
      setDestaques([]);
    }
    setLugares(lugaresRes.data ?? []);
    setForm((current) => ({
      ...current,
      lugar_id: current.lugar_id || lugaresRes.data?.[0]?.id || "",
    }));
  }

  async function handleSubmit(event) {
    event.preventDefault();
    const supabase = createClient();
    await supabase.from("destaques").insert(form);
    setForm({
      lugar_id: lugares[0]?.id || "",
      data_inicio: "",
      data_fim: "",
      ativo: true,
    });
    await loadData();
  }

  async function toggleAtivo(destaque) {
    const supabase = createClient();
    const next = !destaque.ativo;
    setDestaques((items) =>
      items.map((item) => (item.id === destaque.id ? { ...item, ativo: next } : item))
    );
    await supabase.from("destaques").update({ ativo: next }).eq("id", destaque.id);
  }

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-[#f0f4f3] text-[#5a6b66]">
        Carregando admin...
      </div>
    );
  }

  return (
    <AdminShell title="Destaques">
      <form onSubmit={handleSubmit} className="mb-6 rounded-2xl bg-white p-5 shadow-sm">
        <div className="grid gap-4 md:grid-cols-4">
          <label className="text-sm font-semibold text-[#1a2e28] md:col-span-2">
            Lugar
            <select
              value={form.lugar_id}
              onChange={(e) => setForm({ ...form, lugar_id: e.target.value })}
              className="mt-1 w-full rounded-xl bg-[#f0f4f3] px-3 py-2 text-sm font-normal"
            >
              {lugares.map((lugar) => (
                <option key={lugar.id} value={lugar.id}>
                  {lugar.nome}
                </option>
              ))}
            </select>
          </label>
          <label className="text-sm font-semibold text-[#1a2e28]">
            Data início
            <input
              type="date"
              value={form.data_inicio}
              onChange={(e) => setForm({ ...form, data_inicio: e.target.value })}
              className="mt-1 w-full rounded-xl bg-[#f0f4f3] px-3 py-2 text-sm font-normal"
            />
          </label>
          <label className="text-sm font-semibold text-[#1a2e28]">
            Data fim
            <input
              type="date"
              value={form.data_fim}
              onChange={(e) => setForm({ ...form, data_fim: e.target.value })}
              className="mt-1 w-full rounded-xl bg-[#f0f4f3] px-3 py-2 text-sm font-normal"
            />
          </label>
        </div>
        <label className="mt-4 flex items-center gap-2 text-sm font-semibold text-[#1a2e28]">
          <input
            type="checkbox"
            checked={form.ativo}
            onChange={(e) => setForm({ ...form, ativo: e.target.checked })}
          />
          Ativo
        </label>
        <button className="mt-4 rounded-xl bg-[#1a4a3a] px-4 py-2 text-sm font-semibold text-white">
          Criar destaque
        </button>
      </form>

      <div className="grid gap-3">
        {destaques.length === 0 ? (
          <p className="rounded-2xl bg-white p-5 text-sm text-[#5a6b66] shadow-sm">
            Nenhum destaque encontrado.
          </p>
        ) : (
          destaques.map((destaque) => (
            <article
              key={destaque.id}
              className="flex flex-col gap-3 rounded-2xl bg-white p-5 shadow-sm md:flex-row md:items-center md:justify-between"
            >
              <div>
                <p className="font-bold text-[#1a2e28]">
                  {destaque.lugares?.nome || destaque.lugar_id}
                </p>
                <p className="text-sm text-[#5a6b66]">
                  {destaque.data_inicio || "sem início"} → {destaque.data_fim || "sem fim"}
                </p>
              </div>
              <button
                type="button"
                onClick={() => toggleAtivo(destaque)}
                className={`rounded-full px-4 py-2 text-sm font-semibold ${
                  destaque.ativo
                    ? "bg-[#d4ede8] text-[#1a4a3a]"
                    : "bg-zinc-200 text-zinc-600"
                }`}
              >
                {destaque.ativo ? "Ativo" : "Inativo"}
              </button>
            </article>
          ))
        )}
      </div>
    </AdminShell>
  );
}
