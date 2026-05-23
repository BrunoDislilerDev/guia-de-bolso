"use client";

import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { Suspense, useCallback, useEffect, useMemo, useState } from "react";
import AdminShell, { useAdminAuth } from "@/components/admin/AdminShell";
import {
  fetchDestaquesAdmin,
  getDestaqueStatus,
  getPlanoComercialLabel,
  hojeISO,
} from "@/lib/destaques";
import { ensurePlanoComercial, PLANO_COMERCIAL_PRECO } from "@/lib/planoComercial";
import { createClient } from "@/lib/supabase";

const STATUS_STYLES = {
  vigente: "bg-[#d4ede8] text-[#1a4a3a]",
  agendado: "bg-amber-100 text-amber-900",
  expirado: "bg-zinc-200 text-zinc-600",
  inativo: "bg-red-50 text-red-700",
};

const STATUS_LABELS = {
  vigente: "Vigente",
  agendado: "Agendado",
  expirado: "Expirado",
  inativo: "Inativo",
};

/**
 * Soma dias a uma data ISO (YYYY-MM-DD).
 * @param {string} iso
 * @param {number} dias
 * @returns {string}
 */
function addDaysISO(iso, dias) {
  const d = new Date(`${iso}T12:00:00`);
  d.setDate(d.getDate() + dias);
  return hojeISO(d);
}

/**
 * Detecta preset 30/60/90 quando início é hoje e fim bate o intervalo.
 * @param {string} dataInicio
 * @param {string} dataFim
 * @param {string} hojeRef
 * @returns {30|60|90|null}
 */
function getDuracaoPresetAtivo(dataInicio, dataFim, hojeRef) {
  if (dataInicio !== hojeRef) return null;
  const start = new Date(`${hojeRef}T12:00:00`);
  const end = new Date(`${dataFim}T12:00:00`);
  const diffDays = Math.round((end - start) / (24 * 60 * 60 * 1000));
  if (diffDays === 30) return 30;
  if (diffDays === 60) return 60;
  if (diffDays === 90) return 90;
  return null;
}

/**
 * @param {boolean} active
 * @returns {string}
 */
function duracaoChipClass(active) {
  return active
    ? "rounded-lg bg-[#1a4a3a] px-3 py-1.5 text-xs font-semibold text-white shadow-md shadow-[#1a4a3a]/20"
    : "rounded-lg bg-[#f0f4f3] px-3 py-1.5 text-xs font-semibold text-[#1a4a3a] ring-1 ring-[#e3e9e6] transition hover:bg-[#e8eeee]";
}

/**
 * Admin de destaques comerciais (plano único Parceiro · R$ 199/mês).
 * @returns {import("react").ReactElement}
 */
function AdminDestaquesPage() {
  const { loading } = useAdminAuth();
  const searchParams = useSearchParams();
  const filtroLista = searchParams.get("status");
  const [destaques, setDestaques] = useState([]);
  const [lugares, setLugares] = useState([]);
  const [plano, setPlano] = useState(null);
  const [submitting, setSubmitting] = useState(false);
  const [message, setMessage] = useState("");
  const hoje = hojeISO();
  const [form, setForm] = useState({
    lugar_id: "",
    data_inicio: hoje,
    data_fim: addDaysISO(hoje, 30),
    ativo: true,
  });

  const duracaoPresetAtivo = useMemo(
    () => getDuracaoPresetAtivo(form.data_inicio, form.data_fim, hoje),
    [form.data_inicio, form.data_fim, hoje]
  );

  const loadData = useCallback(async () => {
    const supabase = createClient();
    const [destaquesList, lugaresRes, planoRow] = await Promise.all([
      fetchDestaquesAdmin(supabase),
      supabase
        .from("lugares")
        .select("id,nome,status")
        .eq("status", "ativo")
        .order("nome"),
      ensurePlanoComercial(supabase),
    ]);

    setDestaques(destaquesList);
    setLugares(lugaresRes.data ?? []);
    setPlano(planoRow);
    setForm((current) => ({
      ...current,
      lugar_id: current.lugar_id || lugaresRes.data?.[0]?.id || "",
    }));
  }, []);

  useEffect(() => {
    if (loading) return undefined;
    const timer = setTimeout(() => loadData(), 0);
    return () => clearTimeout(timer);
  }, [loading, loadData]);

  const stats = useMemo(() => {
    const counts = { vigente: 0, agendado: 0, expirado: 0, inativo: 0 };
    for (const d of destaques) {
      counts[getDestaqueStatus(d, hoje)] += 1;
    }
    return counts;
  }, [destaques, hoje]);

  const destaquesFiltrados = useMemo(() => {
    if (!filtroLista) return destaques;
    if (filtroLista === "expirando") {
      const limite = addDaysISO(hoje, 3);
      return destaques.filter((d) => {
        const st = getDestaqueStatus(d, hoje);
        return (
          d.ativo &&
          st === "vigente" &&
          d.data_fim &&
          d.data_fim >= hoje &&
          d.data_fim <= limite
        );
      });
    }
    if (filtroLista === "expirado") {
      return destaques.filter(
        (d) => d.ativo && getDestaqueStatus(d, hoje) === "expirado"
      );
    }
    return destaques;
  }, [destaques, filtroLista, hoje]);

  /**
   * @param {import("react").FormEvent} event
   * @returns {Promise<void>}
   */
  async function handleSubmit(event) {
    event.preventDefault();
    setMessage("");

    if (!form.lugar_id || !form.data_inicio || !form.data_fim) {
      setMessage("Preencha o local e o período.");
      return;
    }

    if (!plano?.id) {
      setMessage(
        "Plano Parceiro não encontrado. Rode supabase/plano_comercial_unico.sql no Supabase."
      );
      return;
    }

    if (form.data_fim < form.data_inicio) {
      setMessage("A data fim deve ser igual ou posterior à data início.");
      return;
    }

    const supabase = createClient();
    setSubmitting(true);

    const { error } = await supabase.from("destaques").insert({
      lugar_id: form.lugar_id,
      plano_id: plano.id,
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
      data_inicio: hoje,
      data_fim: addDaysISO(hoje, 30),
      ativo: true,
    });
    await loadData();
    setMessage("Parceiro adicionado ao carrossel com sucesso.");
  }

  /**
   * @param {object} destaque
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
   * @param {object} destaque
   * @returns {Promise<void>}
   */
  async function removeDestaque(destaque) {
    const nome = destaque.lugares?.nome || "este local";
    if (!window.confirm(`Remover destaque de "${nome}"?`)) return;

    const supabase = createClient();
    setDestaques((items) => items.filter((item) => item.id !== destaque.id));
    const { error } = await supabase.from("destaques").delete().eq("id", destaque.id);
    if (error) {
      await loadData();
      setMessage("Não foi possível remover.");
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
    <AdminShell title="Destaques comerciais">
      <div className="mb-6 rounded-2xl border border-[#e3ebe7] bg-[#eef8f4] p-4">
        <p className="text-sm font-semibold text-[#1a4a3a]">Plano único (V1)</p>
        <p className="mt-1 text-sm text-[#5a6b66]">
          {plano
            ? getPlanoComercialLabel(plano)
            : `Parceiro · R$ ${PLANO_COMERCIAL_PRECO}/mês — configure no Supabase`}
        </p>
        <p className="mt-2 text-xs text-[#5a6b66]">
          Visibilidade premium no app + perfil completo do estabelecimento. Não use mais o
          checkbox &quot;Destaque&quot; em Locais — gerencie aqui.
        </p>
      </div>

      <div className="mb-6 grid grid-cols-2 gap-2 sm:grid-cols-4">
        {(["vigente", "agendado", "expirado", "inativo"]).map((key) => (
          <div key={key} className="rounded-xl bg-white p-3 shadow-sm">
            <p className="text-xs font-semibold uppercase text-[#5a6b66]">{STATUS_LABELS[key]}</p>
            <p className="mt-1 text-xl font-bold text-[#1a2e28]">{stats[key]}</p>
          </div>
        ))}
      </div>

      <form onSubmit={handleSubmit} className="mb-6 rounded-2xl bg-white p-5 shadow-sm">
        <h2 className="text-lg font-bold text-[#1a2e28]">Novo parceiro em destaque</h2>
        <p className="mt-1 text-sm text-[#5a6b66]">
          Local ativo + período de vigência. Plano aplicado automaticamente.
        </p>

        <div className="mt-4 grid gap-4 md:grid-cols-2">
          <label className="text-sm font-semibold text-[#1a2e28] md:col-span-2">
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

        <div className="mt-3 flex flex-wrap gap-2">
          <button
            type="button"
            className={duracaoChipClass(duracaoPresetAtivo === 30)}
            onClick={() =>
              setForm((f) => ({
                ...f,
                data_inicio: hoje,
                data_fim: addDaysISO(hoje, 30),
              }))
            }
          >
            30 dias
          </button>
          <button
            type="button"
            className={duracaoChipClass(duracaoPresetAtivo === 60)}
            onClick={() =>
              setForm((f) => ({
                ...f,
                data_inicio: hoje,
                data_fim: addDaysISO(hoje, 60),
              }))
            }
          >
            60 dias
          </button>
          <button
            type="button"
            className={duracaoChipClass(duracaoPresetAtivo === 90)}
            onClick={() =>
              setForm((f) => ({
                ...f,
                data_inicio: hoje,
                data_fim: addDaysISO(hoje, 90),
              }))
            }
          >
            90 dias
          </button>
        </div>

        <label className="mt-4 flex items-center gap-2 text-sm font-semibold text-[#1a2e28]">
          <input
            type="checkbox"
            checked={form.ativo}
            onChange={(e) => setForm({ ...form, ativo: e.target.checked })}
          />
          Ativo ao criar
        </label>

        {message && (
          <p className="mt-3 text-sm font-medium text-[#5a6b66]" role="status">
            {message}
          </p>
        )}

        <button
          type="submit"
          disabled={submitting || !plano?.id}
          className="mt-4 rounded-xl bg-[#1a4a3a] px-4 py-2 text-sm font-semibold text-white disabled:opacity-60"
        >
          {submitting ? "Salvando..." : "Ativar destaque"}
        </button>
      </form>

      {filtroLista && (
        <p className="mb-4 rounded-xl bg-amber-50 px-3 py-2 text-sm font-medium text-amber-900">
          Filtro ativo:{" "}
          {filtroLista === "expirando"
            ? "expirando em até 3 dias"
            : "expirados, ainda ativos"}
          {" · "}
          <Link href="/admin/destaques" className="font-semibold underline">
            Ver todos
          </Link>
        </p>
      )}

      <div className="grid gap-3">
        {destaquesFiltrados.length === 0 ? (
          <p className="rounded-2xl bg-white p-5 text-sm text-[#5a6b66] shadow-sm">
            {filtroLista
              ? "Nenhum destaque neste filtro."
              : "Nenhum destaque cadastrado. O carrossel da home usa apenas registros vigentes nesta lista."}
          </p>
        ) : (
          destaquesFiltrados.map((destaque) => {
            const status = getDestaqueStatus(destaque, hoje);
            const lugarId = destaque.lugar_id || destaque.lugares?.id;

            return (
              <article
                key={destaque.id}
                className="flex flex-col gap-3 rounded-2xl bg-white p-5 shadow-sm md:flex-row md:items-center md:justify-between"
              >
                <div>
                  <div className="flex flex-wrap items-center gap-2">
                    <p className="font-bold text-[#1a2e28]">
                      {destaque.lugares?.nome || destaque.lugar_id}
                    </p>
                    <span
                      className={`rounded-full px-2.5 py-0.5 text-xs font-bold ${STATUS_STYLES[status]}`}
                    >
                      {STATUS_LABELS[status]}
                    </span>
                  </div>
                  <p className="mt-1 text-sm text-[#5a6b66]">
                    {getPlanoComercialLabel(destaque.planos)}
                  </p>
                  <p className="mt-1 text-sm text-[#5a6b66]">
                    {destaque.data_inicio} → {destaque.data_fim}
                  </p>
                  {lugarId && (
                    <Link
                      href={`/lugares/${lugarId}`}
                      className="mt-2 inline-block text-xs font-semibold text-[#1a4a3a] hover:underline"
                    >
                      Ver no app →
                    </Link>
                  )}
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
            );
          })
        )}
      </div>
    </AdminShell>
  );
}

export default function AdminDestaquesPageWithSuspense() {
  return (
    <Suspense
      fallback={
        <div className="flex min-h-screen items-center justify-center bg-[#f0f4f3] text-[#5a6b66]">
          Carregando admin...
        </div>
      }
    >
      <AdminDestaquesPage />
    </Suspense>
  );
}
