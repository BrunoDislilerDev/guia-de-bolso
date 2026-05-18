"use client";

import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import EnderecoAutocomplete from "@/components/EnderecoAutocomplete";
import HorarioEditor from "@/components/admin/HorarioEditor";
import { createClient } from "@/lib/supabase";
import { getTagIds } from "@/lib/tags";

const emptyHorario = {
  dom: "fechado",
  seg: "08:00-18:00",
  ter: "08:00-18:00",
  qua: "08:00-18:00",
  qui: "08:00-18:00",
  sex: "08:00-18:00",
  sab: "09:00-18:00",
};

export const emptyLocalForm = {
  nome: "",
  descricao: "",
  categoria: "Natureza",
  subcategoria: "",
  distancia: "",
  imagem_url: "",
  destaque: false,
  telefone: "",
  instagram: "",
  cardapio_url: "",
  site_url: "",
  endereco: "",
  descricao_longa: "",
  status: "ativo",
  horarios: emptyHorario,
};

const categorias = [
  "Natureza",
  "Gastronomia",
  "Noite",
  "Serviços",
  "Hospedagem",
  "Cultura",
  "Aventura",
  "Bem-estar",
  "Compras",
];

function Input({ label, ...props }) {
  return (
    <label className="block text-sm font-semibold text-[#1a2e28]">
      {label}
      <input
        {...props}
        className="mt-1 w-full rounded-xl bg-[#f0f4f3] px-3 py-2 text-sm font-normal outline-none ring-[#1a4a3a]/20 focus:ring-2"
      />
    </label>
  );
}

export default function LocalForm({
  initialData = emptyLocalForm,
  initialLocalizacao = null,
  initialTags = [],
  editingId = null,
}) {
  const router = useRouter();
  const [saving, setSaving] = useState(false);
  const [localizacao, setLocalizacao] = useState(initialLocalizacao);
  const [subcategorias, setSubcategorias] = useState([]);
  const [tags, setTags] = useState([]);
  const [selectedTagIds, setSelectedTagIds] = useState(getTagIds(initialTags));
  const [form, setForm] = useState({
    ...emptyLocalForm,
    ...initialData,
    horarios: initialData?.horarios || emptyHorario,
  });

  useEffect(() => {
    const supabase = createClient();

    supabase
      .from("tags")
      .select("*")
      .order("nome")
      .then(({ data }) => setTags(data ?? []));
  }, []);

  useEffect(() => {
    const supabase = createClient();

    supabase
      .from("subcategorias")
      .select("*")
      .eq("categoria", form.categoria)
      .order("nome")
      .then(({ data }) => {
        const items = data ?? [];
        setSubcategorias(items);

        if (form.subcategoria && !items.some((item) => item.nome === form.subcategoria)) {
          setForm((current) => ({ ...current, subcategoria: "" }));
        }
      });
  }, [form.categoria, form.subcategoria]);

  function toggleTag(tagId) {
    setSelectedTagIds((current) =>
      current.includes(tagId)
        ? current.filter((id) => id !== tagId)
        : [...current, tagId]
    );
  }

  async function handleSubmit(event) {
    event.preventDefault();
    setSaving(true);
    const supabase = createClient();
    const payload = {
      ...form,
      endereco: localizacao?.endereco_completo || form.endereco || "",
      destaque: Boolean(form.destaque),
      horarios: form.horarios,
    };
    let lugarId = editingId;

    if (editingId) {
      await supabase.from("lugares").update(payload).eq("id", editingId);
    } else {
      const { data } = await supabase
        .from("lugares")
        .insert(payload)
        .select("id")
        .single();
      lugarId = data?.id;
    }

    if (lugarId && localizacao?.endereco_completo) {
      await supabase.from("localizacoes").upsert(
        {
          lugar_id: lugarId,
          rua: localizacao.rua || null,
          numero: localizacao.numero || null,
          bairro: localizacao.bairro || null,
          cidade: localizacao.cidade || null,
          estado: localizacao.estado || null,
          cep: localizacao.cep || null,
          pais: localizacao.pais || "Brasil",
          endereco_completo: localizacao.endereco_completo,
          latitude: localizacao.latitude,
          longitude: localizacao.longitude,
        },
        { onConflict: "lugar_id" }
      );
    }

    if (lugarId) {
      await supabase.from("lugares_tags").delete().eq("lugar_id", lugarId);

      if (selectedTagIds.length > 0) {
        await supabase.from("lugares_tags").insert(
          selectedTagIds.map((tagId) => ({
            lugar_id: lugarId,
            tag_id: Number(tagId),
          }))
        );
      }
    }

    router.push("/admin/locais");
  }

  return (
    <form onSubmit={handleSubmit} className="rounded-2xl bg-white p-5 shadow-sm">
      <div className="grid gap-4 md:grid-cols-2">
        <Input label="Nome" value={form.nome || ""} onChange={(e) => setForm({ ...form, nome: e.target.value })} required />
        <label className="block text-sm font-semibold text-[#1a2e28]">
          Categoria
          <select
            value={form.categoria}
            onChange={(e) => setForm({ ...form, categoria: e.target.value, subcategoria: "" })}
            className="mt-1 w-full rounded-xl bg-[#f0f4f3] px-3 py-2 text-sm font-normal outline-none"
          >
            {categorias.map((cat) => <option key={cat}>{cat}</option>)}
          </select>
        </label>
        <label className="block text-sm font-semibold text-[#1a2e28]">
          Subcategoria
          <select
            value={form.subcategoria || ""}
            onChange={(e) => setForm({ ...form, subcategoria: e.target.value })}
            className="mt-1 w-full rounded-xl bg-[#f0f4f3] px-3 py-2 text-sm font-normal outline-none"
          >
            <option value="">Sem subcategoria</option>
            {subcategorias.map((subcategoria) => (
              <option key={subcategoria.id} value={subcategoria.nome}>
                {subcategoria.icone ? `${subcategoria.icone} ` : ""}
                {subcategoria.nome}
              </option>
            ))}
          </select>
        </label>
        <label className="block text-sm font-semibold text-[#1a2e28]">
          Status
          <select value={form.status || "ativo"} onChange={(e) => setForm({ ...form, status: e.target.value })} className="mt-1 w-full rounded-xl bg-[#f0f4f3] px-3 py-2 text-sm font-normal outline-none">
            <option value="ativo">ativo</option>
            <option value="desativado">desativado</option>
            <option value="em_analise">em_analise</option>
          </select>
        </label>
        <Input label="Distância" value={form.distancia || ""} onChange={(e) => setForm({ ...form, distancia: e.target.value })} />
        <Input label="Imagem URL" value={form.imagem_url || ""} onChange={(e) => setForm({ ...form, imagem_url: e.target.value })} />
        <Input label="Telefone" value={form.telefone || ""} onChange={(e) => setForm({ ...form, telefone: e.target.value })} />
        <Input label="Instagram" value={form.instagram || ""} onChange={(e) => setForm({ ...form, instagram: e.target.value })} />
        <Input label="Cardápio URL" value={form.cardapio_url || ""} onChange={(e) => setForm({ ...form, cardapio_url: e.target.value })} />
        <Input label="Site URL" value={form.site_url || ""} onChange={(e) => setForm({ ...form, site_url: e.target.value })} />
        <label className="flex items-center gap-2 text-sm font-semibold text-[#1a2e28]">
          <input type="checkbox" checked={Boolean(form.destaque)} onChange={(e) => setForm({ ...form, destaque: e.target.checked })} />
          Destaque
        </label>
      </div>

      <div className="mt-4">
        <p className="mb-2 text-sm font-semibold text-[#1a2e28]">Tags</p>
        <div className="grid gap-2 rounded-2xl bg-[#f7faf9] p-3 md:grid-cols-3">
          {tags.length === 0 ? (
            <p className="text-sm text-[#5a6b66]">Nenhuma tag cadastrada.</p>
          ) : (
            tags.map((tag) => {
              const tagId = String(tag.id);
              return (
                <label
                  key={tag.id}
                  className="flex items-center gap-2 rounded-xl bg-white px-3 py-2 text-sm font-semibold text-[#1a2e28]"
                >
                  <input
                    type="checkbox"
                    checked={selectedTagIds.includes(tagId)}
                    onChange={() => toggleTag(tagId)}
                  />
                  <span>{tag.icone}</span>
                  {tag.nome}
                </label>
              );
            })
          )}
        </div>
      </div>

      <div className="mt-4">
        <p className="mb-2 text-sm font-semibold text-[#1a2e28]">
          Endereço estruturado
        </p>
        <EnderecoAutocomplete
          initialValue={localizacao}
          onSave={(value) => setLocalizacao(value)}
        />
      </div>

      <label className="mt-4 block text-sm font-semibold text-[#1a2e28]">
        Descrição
        <textarea value={form.descricao || ""} onChange={(e) => setForm({ ...form, descricao: e.target.value })} className="mt-1 min-h-20 w-full rounded-xl bg-[#f0f4f3] p-3 text-sm font-normal outline-none" />
      </label>

      <label className="mt-4 block text-sm font-semibold text-[#1a2e28]">
        Descrição longa
        <textarea value={form.descricao_longa || ""} onChange={(e) => setForm({ ...form, descricao_longa: e.target.value })} className="mt-1 min-h-24 w-full rounded-xl bg-[#f0f4f3] p-3 text-sm font-normal outline-none" />
      </label>

      <div className="mt-4">
        <p className="text-sm font-semibold text-[#1a2e28]">Horários</p>
        <div className="mt-2">
          <HorarioEditor
            horarios={form.horarios}
            onChange={(horarios) => setForm({ ...form, horarios })}
          />
        </div>
      </div>

      <button disabled={saving} className="mt-5 rounded-xl bg-[#1a4a3a] px-5 py-3 text-sm font-semibold text-white disabled:opacity-60">
        {saving ? "Salvando..." : "Salvar local"}
      </button>
    </form>
  );
}
