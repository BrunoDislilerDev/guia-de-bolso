"use client";

import { useCallback, useEffect, useState } from "react";
import AdminShell, { useAdminAuth } from "@/components/admin/AdminShell";
import { createClient } from "@/lib/supabase";

/**
 * Admin CRUD for featured places (`destaques`) and plan assignment.
 * @returns {import("react").ReactElement}
 */
export default function AdminDestaquesPage() {
  const { loading } = useAdminAuth();
  const [destaques, setDestaques] = useState([]);
  const [lugares, setLugares] = useState([]);
  const [planos, setPlanos] = useState([]);
  const [submitting, setSubmitting] = useState(false);
  const [message, setMessage] = useState("");
  const [form, setForm] = useState({
    lugar_id: "",
    plano_id: "",
    data_inicio: "",
    data_fim: "",
    ativo: true,
  });

  const loadData = useCallback(async () => {
    const supabase = createClient();
    const [destaquesRes, lugaresRes, planosRes] = await Promise.all([
      supabase
        .from("destaques")
        .select("*, lugares(nome), planos(nome, frequencia, preco)")
        .order("data_inicio", { ascending: false }),
      supabase
        .from("lugares")
        .select("id,nome")
        .eq("status", "ativo")
        .order("nome"),
      supabase.from("planos").select("id,nome,frequencia,preco").order("preco"),
    ]);

    if (!destaquesRes.error) {
      setDestaques(destaquesRes.data ?? []);
    } else {
      setDestaques([]);
    }

    setLugares(lugaresRes.data ?? []);
    setPlanos(planosRes.data ?? []);
    setForm((current) => ({
      ...current,
      lugar_id: current.lugar_id || lugaresRes.data?.[0]?.id || "",
      plano_id: current.plano_id || planosRes.data?.[0]?.id || "",
    }));
  }, []);

  useEffect(() => {
    if (loading) return undefined;

    const timer = setTimeout(() => {
      loadData();
    }, 0);

    return () => clearTimeout(timer);
  }, [loading, loadData]);

  /**
   * Creates a new destaque from the admin form.
   * @param {import("react").FormEvent} event - Form submit.
   * @returns {Promise<void>}
   */
  async function handleSubmit(event) {
    event.preventDefault();
    setMessage("");

    if (!form.lugar_id || !form.plano_id || !form.data_inicio || !form.data_fim) {
      setMessage("Preencha lugar, plano e período do destaque.");
      return;
    }

    const supabase = createClient();
    setSubmitting(true);

    const { error } = await supabase.from("destaques").insert({
      lugar_id: Number(form.lugar_id),
      plano_id: Number(form.plano_id),
      data_inicio: form.data_inicio,
      data_fim: form.data_fim,
      ativo: form.ativo,
    });

    setSubmitting(false);

    if (error) {
      setMessage("Não foi possível criar o destaque. Tente novamente.");
      return;
    }

    setForm({
      lugar_id: lugares[0]?.id || "",
      plano_id: planos[0]?.id || "",
      data_inicio: "",
      data_fim: "",
      ativo: true,
    });
    await loadData();
    setMessage("Destaque criado com sucesso.");
  }

  /**
   * Toggles the `ativo` flag on a destaque with optimistic UI.
   * @param {object} destaque - Destaque row.
   * @returns {Promise<void>}
   */
  async function toggleAtivo(destaque) {
    const supabase = createClient();
    const next = !destaque.ativo;
    setDestaques((items) =>
      items.map((item) => (item.id === destaque.id ? { ...item, ativo: next } : item))
    );
    await supabase.from("destaques").update({ ativo: next }).eq("id", destaque.id);
  }

  /**
   * Deletes a destaque after user confirmation.
   * @param {object} destaque - Destaque row.
   * @returns {Promise<void>}
   */
  async function removeDestaque(destaque) {
    const confirmed = window.confirm("Remover este destaque?");
    if (!confirmed) return;

    const supabase = createClient();
    setDestaques((items) => items.filter((item) => item.id !== destaque.id));
    const { error } = await supabase.from("destaques").delete().eq("id", destaque.id);

    if (error) {
      await loadData();
      setMessage("Não foi possível remover o destaque.");
    }
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
        <div className="mb-5">
          <h2 className="text-lg font-bold text-[#1a2e28]">Adicionar destaque</h2>
          <p className="mt-1 text-sm text-[#5a6b66]">
            Escolha o local, plano e período em que o destaque ficará ativo.
          </p>
        </div>

        <div className="grid gap-4 md:grid-cols-2">
          <label className="text-sm font-semibold text-[#1a2e28]">
            Lugar
            <select
              required
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
            Plano
            <select
              required
              value={form.plano_id}
              onChange={(e) => setForm({ ...form, plano_id: e.target.value })}
              className="mt-1 w-full rounded-xl bg-[#f0f4f3] px-3 py-2 text-sm font-normal"
            >
              {planos.map((plano) => (
                <option key={plano.id} value={plano.id}>
                  {plano.nome} — {plano.frequencia} — R$ {Number(plano.preco).toFixed(2)}
                </option>
              ))}
            </select>
          </label>
          <label className="text-sm font-semibold text-[#1a2e28]">
            Data início
            <input
              required
              type="date"
              value={form.data_inicio}
              onChange={(e) => setForm({ ...form, data_inicio: e.target.value })}
              className="mt-1 w-full rounded-xl bg-[#f0f4f3] px-3 py-2 text-sm font-normal"
            />
          </label>
          <label className="text-sm font-semibold text-[#1a2e28]">
            Data fim
            <input
              required
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
        {message && (
          <p className="mt-3 text-sm font-medium text-[#5a6b66]">{message}</p>
        )}
        <button
          type="submit"
          disabled={submitting}
          className="mt-4 rounded-xl bg-[#1a4a3a] px-4 py-2 text-sm font-semibold text-white disabled:opacity-60"
        >
          {submitting ? "Criando..." : "Criar destaque"}
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
                <p className="mt-1 text-sm text-[#5a6b66]">
                  Plano:{" "}
                  <span className="font-semibold text-[#1a4a3a]">
                    {destaque.planos?.nome || destaque.plano_id}
                  </span>
                </p>
                <p className="mt-1 text-sm text-[#5a6b66]">
                  Período: {destaque.data_inicio || "sem início"} →{" "}
                  {destaque.data_fim || "sem fim"}
                </p>
              </div>
              <div className="flex flex-wrap gap-2">
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
                <button
                  type="button"
                  onClick={() => removeDestaque(destaque)}
                  className="rounded-full bg-[#fde2e2] px-4 py-2 text-sm font-semibold text-[#d9534f]"
                >
                  Remover
                </button>
              </div>
            </article>
          ))
        )}
      </div>
    </AdminShell>
  );
}
