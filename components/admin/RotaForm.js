"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import PhotoUploader from "@/components/admin/PhotoUploader";
import { getInitialPhotoItems } from "@/lib/fotos";
import {
  createPhotoItemFromFile,
  getExistingUrlsFromPhotoItems,
  getPendingFilesFromPhotoItems,
  revokePhotoItemPreview,
} from "@/lib/photoItems";
import { createClient } from "@/lib/supabase";
import {
  ROTAS_FOTOS_BUCKET,
  uploadEntityPhotos,
} from "@/lib/storageUpload";

const emptyForm = {
  nome: "",
  descricao: "",
  cidade: "Imbituba",
  categoria: "",
  dificuldade: "Fácil",
  duracao_minutos: "",
  distancia_km: "",
  destaque: false,
  ativa: true,
};

function Field({ label, children }) {
  return (
    <label className="block text-sm font-semibold text-[#1a2e28]">
      {label}
      {children}
    </label>
  );
}

function inputClass() {
  return "mt-1 w-full rounded-xl bg-[#f0f4f3] px-3 py-2 text-sm font-normal outline-none ring-[#1a4a3a]/20 focus:ring-2";
}

function normalizeRota(rota) {
  return {
    ...emptyForm,
    ...(rota ?? {}),
    nome: rota?.nome || rota?.titulo || "",
    duracao_minutos: rota?.duracao_minutos ?? "",
    distancia_km: rota?.distancia_km ?? "",
    ativa: rota?.ativa ?? true,
  };
}

export default function RotaForm({
  initialData = null,
  initialPontos = [],
  editingId = null,
}) {
  const router = useRouter();
  const [saving, setSaving] = useState(false);
  const [photoError, setPhotoError] = useState("");
  const [form, setForm] = useState(normalizeRota(initialData));
  const [photoItems, setPhotoItems] = useState(() =>
    getInitialPhotoItems(initialData, "foto_capa")
  );
  const [pontos, setPontos] = useState(
    initialPontos.map((ponto, index) => ({
      nome: ponto.nome || ponto.titulo || "",
      descricao: ponto.descricao || "",
      ordem: ponto.ordem || index + 1,
    }))
  );
  const [novoPonto, setNovoPonto] = useState({ nome: "", descricao: "" });

  function addPhotoFiles(files) {
    setPhotoError("");
    setPhotoItems((current) => [
      ...current,
      ...files.map((file) => createPhotoItemFromFile(file)),
    ]);
  }

  function removePhotoItem(id) {
    setPhotoItems((current) => {
      const item = current.find((entry) => entry.id === id);
      revokePhotoItemPreview(item);
      return current.filter((entry) => entry.id !== id);
    });
  }

  function addPonto() {
    if (!novoPonto.nome.trim()) return;

    setPontos((current) => [
      ...current,
      {
        nome: novoPonto.nome.trim(),
        descricao: novoPonto.descricao.trim(),
        ordem: current.length + 1,
      },
    ]);
    setNovoPonto({ nome: "", descricao: "" });
  }

  function removePonto(index) {
    setPontos((current) =>
      current
        .filter((_, itemIndex) => itemIndex !== index)
        .map((ponto, itemIndex) => ({ ...ponto, ordem: itemIndex + 1 }))
    );
  }

  function movePonto(index, direction) {
    setPontos((current) => {
      const nextIndex = index + direction;
      if (nextIndex < 0 || nextIndex >= current.length) return current;

      const next = [...current];
      [next[index], next[nextIndex]] = [next[nextIndex], next[index]];
      return next.map((ponto, itemIndex) => ({ ...ponto, ordem: itemIndex + 1 }));
    });
  }

  async function handleSubmit(event) {
    event.preventDefault();
    setSaving(true);
    setPhotoError("");

    const supabase = createClient();
    const payload = {
      nome: form.nome.trim(),
      titulo: form.nome.trim(),
      descricao: form.descricao.trim(),
      cidade: form.cidade,
      categoria: form.categoria.trim() || "Trilha",
      dificuldade: form.dificuldade,
      duracao_minutos: form.duracao_minutos ? Number(form.duracao_minutos) : null,
      distancia_km: form.distancia_km ? Number(form.distancia_km) : null,
      destaque: Boolean(form.destaque),
      ativa: Boolean(form.ativa),
    };

    if (payload.destaque) {
      await supabase.from("rotas").update({ destaque: false }).neq("id", editingId || 0);
    }

    let rotaId = editingId;

    try {
      if (editingId) {
        const { error } = await supabase.from("rotas").update(payload).eq("id", editingId);
        if (error) throw error;
        await supabase.from("rota_pontos").delete().eq("rota_id", editingId);
      } else {
        const { data, error } = await supabase
          .from("rotas")
          .insert(payload)
          .select("id")
          .single();
        if (error) throw error;
        rotaId = data?.id;
      }

      if (!rotaId) throw new Error("Não foi possível salvar a rota.");

      const existingUrls = getExistingUrlsFromPhotoItems(photoItems);
      const pendingFiles = getPendingFilesFromPhotoItems(photoItems);
      const uploadedUrls = await uploadEntityPhotos(
        supabase,
        ROTAS_FOTOS_BUCKET,
        rotaId,
        pendingFiles
      );
      const fotos = [...existingUrls, ...uploadedUrls];
      const capa = fotos[0] || "";

      const { error: fotosError } = await supabase
        .from("rotas")
        .update({
          fotos,
          foto_capa: capa || null,
          imagem_capa: capa || null,
        })
        .eq("id", rotaId);

      if (fotosError) throw fotosError;

      if (pontos.length > 0) {
        const { error: pontosError } = await supabase.from("rota_pontos").insert(
          pontos.map((ponto, index) => ({
            rota_id: rotaId,
            ordem: index + 1,
            nome: ponto.nome,
            descricao: ponto.descricao,
          }))
        );
        if (pontosError) throw pontosError;
      }
    } catch (error) {
      console.error(error);
      setPhotoError(
        error?.message || "Não foi possível salvar as fotos. Tente novamente."
      );
      setSaving(false);
      return;
    }

    router.push(`/admin/rotas?success=${editingId ? "updated" : "created"}`);
  }

  return (
    <form onSubmit={handleSubmit} className="rounded-2xl bg-white p-5 shadow-sm">
      <div className="grid gap-4 md:grid-cols-2">
        <Field label="Nome">
          <input
            required
            value={form.nome}
            onChange={(event) => setForm({ ...form, nome: event.target.value })}
            className={inputClass()}
          />
        </Field>

        <Field label="Cidade">
          <select
            value={form.cidade}
            onChange={(event) => setForm({ ...form, cidade: event.target.value })}
            className={inputClass()}
          >
            <option>Garopaba</option>
            <option>Imbituba</option>
          </select>
        </Field>

        <Field label="Categoria">
          <input
            value={form.categoria}
            placeholder="Trilha"
            onChange={(event) => setForm({ ...form, categoria: event.target.value })}
            className={inputClass()}
          />
        </Field>

        <Field label="Dificuldade">
          <select
            value={form.dificuldade}
            onChange={(event) => setForm({ ...form, dificuldade: event.target.value })}
            className={inputClass()}
          >
            <option>Fácil</option>
            <option>Moderado</option>
            <option>Difícil</option>
          </select>
        </Field>

        <Field label="Duração em minutos">
          <input
            type="number"
            min="0"
            value={form.duracao_minutos}
            onChange={(event) => setForm({ ...form, duracao_minutos: event.target.value })}
            className={inputClass()}
          />
        </Field>

        <Field label="Distância em km">
          <input
            type="number"
            min="0"
            step="0.1"
            value={form.distancia_km}
            onChange={(event) => setForm({ ...form, distancia_km: event.target.value })}
            className={inputClass()}
          />
        </Field>

        <div className="flex items-end gap-5 md:col-span-2">
          <label className="flex items-center gap-2 text-sm font-semibold text-[#1a2e28]">
            <input
              type="checkbox"
              checked={Boolean(form.destaque)}
              onChange={(event) => setForm({ ...form, destaque: event.target.checked })}
            />
            Destaque
          </label>
          <label className="flex items-center gap-2 text-sm font-semibold text-[#1a2e28]">
            <input
              type="checkbox"
              checked={Boolean(form.ativa)}
              onChange={(event) => setForm({ ...form, ativa: event.target.checked })}
            />
            Ativa
          </label>
        </div>
      </div>

      <PhotoUploader
        items={photoItems}
        onAddFiles={addPhotoFiles}
        onRemove={removePhotoItem}
        disabled={saving}
        error={photoError}
      />

      <label className="mt-4 block text-sm font-semibold text-[#1a2e28]">
        Descrição
        <textarea
          rows={4}
          value={form.descricao}
          onChange={(event) => setForm({ ...form, descricao: event.target.value })}
          className="mt-1 w-full rounded-xl bg-[#f0f4f3] p-3 text-sm font-normal outline-none ring-[#1a4a3a]/20 focus:ring-2"
        />
      </label>

      <section className="mt-6 rounded-2xl bg-[#f7faf9] p-4">
        <h2 className="text-lg font-bold text-[#1a2e28]">Pontos do Percurso</h2>

        <div className="mt-4 grid gap-3">
          {pontos.length === 0 ? (
            <p className="text-sm text-[#5a6b66]">Nenhum ponto adicionado.</p>
          ) : (
            pontos.map((ponto, index) => (
              <article key={`${ponto.ordem}-${ponto.nome}`} className="rounded-2xl bg-white p-3 shadow-sm">
                <div className="flex items-start gap-3">
                  <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-[#1a4a3a] text-sm font-bold text-white">
                    {index + 1}
                  </span>
                  <div className="min-w-0 flex-1">
                    <h3 className="font-bold text-[#1a2e28]">{ponto.nome}</h3>
                    <p className="mt-1 text-sm text-[#5a6b66]">{ponto.descricao}</p>
                    <div className="mt-3 flex flex-wrap gap-2">
                      <button type="button" onClick={() => movePonto(index, -1)} className="rounded-lg bg-zinc-100 px-3 py-1 text-xs font-semibold text-zinc-700">
                        ↑
                      </button>
                      <button type="button" onClick={() => movePonto(index, 1)} className="rounded-lg bg-zinc-100 px-3 py-1 text-xs font-semibold text-zinc-700">
                        ↓
                      </button>
                      <button type="button" onClick={() => removePonto(index)} className="rounded-lg bg-[#fde2e2] px-3 py-1 text-xs font-semibold text-[#d9534f]">
                        Remover
                      </button>
                    </div>
                  </div>
                </div>
              </article>
            ))
          )}
        </div>

        <div className="mt-4 grid gap-3 rounded-2xl bg-white p-3 md:grid-cols-[1fr_2fr_auto]">
          <input
            value={novoPonto.nome}
            placeholder="Nome do ponto"
            onChange={(event) => setNovoPonto({ ...novoPonto, nome: event.target.value })}
            className={inputClass()}
          />
          <textarea
            value={novoPonto.descricao}
            placeholder="Descrição"
            onChange={(event) => setNovoPonto({ ...novoPonto, descricao: event.target.value })}
            className="mt-1 min-h-10 rounded-xl bg-[#f0f4f3] p-3 text-sm outline-none ring-[#1a4a3a]/20 focus:ring-2"
          />
          <button
            type="button"
            onClick={addPonto}
            className="rounded-xl bg-[#1a4a3a] px-4 py-2 text-sm font-semibold text-white"
          >
            Adicionar Ponto
          </button>
        </div>
      </section>

      <div className="mt-5 flex flex-col gap-2 md:flex-row md:justify-end">
        <Link
          href="/admin/rotas"
          className="rounded-xl bg-zinc-200 px-5 py-3 text-center text-sm font-semibold text-zinc-700"
        >
          Cancelar
        </Link>
        <button
          disabled={saving}
          className="rounded-xl bg-[#1a4a3a] px-5 py-3 text-sm font-semibold text-white disabled:opacity-60"
        >
          {saving ? "Salvando..." : editingId ? "Salvar alterações" : "Salvar Rota"}
        </button>
      </div>
    </form>
  );
}
