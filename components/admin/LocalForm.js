"use client";

import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import EnderecoAutocomplete from "@/components/EnderecoAutocomplete";
import HorarioEditor from "@/components/admin/HorarioEditor";
import PhotoUploader from "@/components/admin/PhotoUploader";
import { getInitialPhotoItems } from "@/lib/fotos";
import {
  buildFotosUrlsFromPhotoItems,
  createPhotoItemFromFile,
  getPendingFilesFromPhotoItems,
  movePhotoItemToCover,
  revokePhotoItemPreview,
} from "@/lib/photoItems";
import { createClient } from "@/lib/supabase";
import {
  LUGARES_FOTOS_BUCKET,
  getStorageErrorMessage,
  uploadEntityPhotos,
} from "@/lib/storageUpload";
import {
  filterTagIdsByCategoria,
  filterTagsByCategoria,
  getTagIds,
} from "@/lib/tags";

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
  telefone: "",
  instagram: "",
  cardapio_url: "",
  site_url: "",
  descricao_longa: "",
  status: "ativo",
  horarios: emptyHorario,
  mostrar_endereco: true,
  mostrar_horarios: true,
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

const MAX_TAGS = 5;

/**
 * Aplica máscara brasileira ao telefone enquanto o usuário digita (até 11 dígitos).
 * @param {string} value - Valor bruto do input.
 * @returns {string} Telefone formatado, ex.: "(48) 9 1234-5678".
 */
function formatTelefone(value) {
  const digits = String(value || "").replace(/\D/g, "").slice(0, 11);
  if (!digits) return "";
  if (digits.length <= 2) return `(${digits}`;
  if (digits.length <= 3) return `(${digits.slice(0, 2)}) ${digits.slice(2)}`;
  if (digits.length <= 7) {
    return `(${digits.slice(0, 2)}) ${digits.slice(2, 3)} ${digits.slice(3)}`;
  }
  return `(${digits.slice(0, 2)}) ${digits.slice(2, 3)} ${digits.slice(3, 7)}-${digits.slice(7)}`;
}

/**
 * Campo de formulário com label e input estilizado.
 * @param {object} props
 * @param {string} props.label - Texto do label.
 * @returns {import("react").JSX.Element}
 */
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

/**
 * Formulário admin de criação/edição de lugar (dados, fotos, tags, horários e localização).
 * @param {object} props
 * @param {typeof emptyLocalForm} [props.initialData] - Valores iniciais do lugar.
 * @param {object|null} [props.initialLocalizacao] - Registro de `localizacoes` vinculado.
 * @param {Array<{ id: number|string }>} [props.initialTags] - Tags já associadas.
 * @param {string|null} [props.editingId] - UUID do lugar em edição; null para novo.
 * @returns {import("react").JSX.Element}
 */
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
  const [selectedTagIds, setSelectedTagIds] = useState(
    () => getTagIds(initialTags).slice(0, MAX_TAGS)
  );
  const [tagLimitMessage, setTagLimitMessage] = useState("");
  const [photoItems, setPhotoItems] = useState(() => getInitialPhotoItems(initialData));
  const [photoError, setPhotoError] = useState("");
  const { destaque: _destaqueLegado, ...initialSemDestaque } = initialData ?? {};

  const [form, setForm] = useState({
    ...emptyLocalForm,
    ...initialSemDestaque,
    horarios: initialData?.horarios || emptyHorario,
    telefone: formatTelefone(initialData?.telefone),
    mostrar_endereco: initialData?.mostrar_endereco ?? true,
    mostrar_horarios: initialData?.mostrar_horarios ?? true,
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

  useEffect(() => {
    if (tags.length === 0) return;

    setSelectedTagIds((current) =>
      filterTagIdsByCategoria(current, tags, form.categoria).slice(0, MAX_TAGS)
    );
    setTagLimitMessage("");
  }, [form.categoria, tags]);

  const visibleTags = filterTagsByCategoria(tags, form.categoria);

  /**
   * Alterna seleção de tag respeitando o limite de {@link MAX_TAGS}.
   * @param {string} tagId - ID da tag como string.
   */
  function toggleTag(tagId) {
    setSelectedTagIds((current) => {
      if (current.includes(tagId)) {
        setTagLimitMessage("");
        return current.filter((id) => id !== tagId);
      }
      if (current.length >= MAX_TAGS) {
        setTagLimitMessage(`Você pode selecionar no máximo ${MAX_TAGS} tags.`);
        return current;
      }
      setTagLimitMessage("");
      return [...current, tagId];
    });
  }

  /**
   * Adiciona arquivos pendentes de upload à fila de fotos do lugar.
   * @param {File[]} files - Arquivos de imagem aceitos.
   */
  function addPhotoFiles(files) {
    setPhotoError("");
    setPhotoItems((current) => [
      ...current,
      ...files.map((file) => createPhotoItemFromFile(file)),
    ]);
  }

  /**
   * Remove um item da galeria e revoga preview blob se existir.
   * @param {string} id - ID interno do item em `photoItems`.
   */
  function removePhotoItem(id) {
    setPhotoItems((current) => {
      const item = current.find((entry) => entry.id === id);
      revokePhotoItemPreview(item);
      return current.filter((entry) => entry.id !== id);
    });
  }

  function setPhotoCover(id) {
    setPhotoItems((current) => movePhotoItemToCover(current, id));
  }

  /**
   * Persiste lugar, fotos no Storage, localização e vínculos de tags no Supabase.
   * @param {import("react").FormEvent<HTMLFormElement>} event - Evento de submit do formulário.
   */
  async function handleSubmit(event) {
    event.preventDefault();
    setSaving(true);
    setPhotoError("");
    const supabase = createClient();
    const {
      imagem_url: _imagemUrl,
      fotos: _fotos,
      endereco: _endereco,
      destaque: _destaqueCampo,
      ...formFields
    } = form;
    const payload = {
      ...formFields,
      mostrar_endereco: Boolean(form.mostrar_endereco),
      mostrar_horarios: Boolean(form.mostrar_horarios),
      horarios: form.horarios,
    };
    let lugarId = editingId;
    const pendingFiles = getPendingFilesFromPhotoItems(photoItems);

    try {
      if (editingId) {
        const { error } = await supabase.from("lugares").update(payload).eq("id", editingId);
        if (error) throw error;
      } else {
        const { data, error } = await supabase
          .from("lugares")
          .insert(payload)
          .select("id")
          .single();
        if (error) throw error;
        lugarId = data?.id;
      }

      if (!lugarId) throw new Error("Não foi possível salvar o local.");
    } catch (error) {
      console.error(error);
      setPhotoError(
        error?.message ||
          "Não foi possível salvar o local. Se o erro citar colunas mostrar_endereco ou mostrar_horarios, rode supabase/lugares_visibilidade.sql no SQL Editor."
      );
      setSaving(false);
      return;
    }

    try {
      if (pendingFiles.length > 0) {
        const {
          data: { user },
        } = await supabase.auth.getUser();
        if (!user) {
          throw new Error("Faça login para enviar fotos.");
        }
      }

      const uploadedUrls =
        pendingFiles.length > 0
          ? await uploadEntityPhotos(
              supabase,
              LUGARES_FOTOS_BUCKET,
              lugarId,
              pendingFiles
            )
          : [];
      const fotos = buildFotosUrlsFromPhotoItems(photoItems, uploadedUrls);

      const { error: fotosError } = await supabase
        .from("lugares")
        .update({
          fotos,
          imagem_url: fotos[0] || null,
        })
        .eq("id", lugarId);

      if (fotosError) throw fotosError;
    } catch (error) {
      console.error(error);
      setPhotoError(
        getStorageErrorMessage(error) ||
          error?.message ||
          "Não foi possível salvar as fotos. Tente novamente."
      );
      setSaving(false);
      return;
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
        <Input
          label="Telefone"
          type="tel"
          inputMode="numeric"
          placeholder="(48) 9 1234-5678"
          value={form.telefone || ""}
          onChange={(e) => setForm({ ...form, telefone: formatTelefone(e.target.value) })}
        />
        <Input label="Instagram" value={form.instagram || ""} onChange={(e) => setForm({ ...form, instagram: e.target.value })} />
        <Input label="Cardápio URL" value={form.cardapio_url || ""} onChange={(e) => setForm({ ...form, cardapio_url: e.target.value })} />
        <Input label="Site URL" value={form.site_url || ""} onChange={(e) => setForm({ ...form, site_url: e.target.value })} />
      </div>

      <p className="mt-4 rounded-xl bg-[#eef8f4] px-3 py-2 text-xs text-[#5a6b66]">
        Destaque comercial (carrossel e perfil completo no app) é gerenciado em{" "}
        <a href="/admin/destaques" className="font-semibold text-[#1a4a3a] underline">
          Admin → Destaques
        </a>
        .
      </p>

      <PhotoUploader
        items={photoItems}
        onAddFiles={addPhotoFiles}
        onRemove={removePhotoItem}
        onSetCover={setPhotoCover}
        disabled={saving}
        error={photoError}
      />

      <div className="mt-4">
        <div className="mb-2 flex items-center justify-between gap-2">
          <p className="text-sm font-semibold text-[#1a2e28]">Tags</p>
          <span className="text-xs font-semibold text-[#5a6b66]">
            {selectedTagIds.length}/{MAX_TAGS} selecionadas
          </span>
        </div>
        {tagLimitMessage && (
          <p className="mb-2 text-xs font-semibold text-[#d9534f]">{tagLimitMessage}</p>
        )}
        <p className="mb-2 text-xs text-[#5a6b66]">Máximo de {MAX_TAGS} tags por local.</p>
        <div className="grid gap-2 rounded-2xl bg-[#f7faf9] p-3 md:grid-cols-3">
          {visibleTags.length === 0 ? (
            <p className="text-sm text-[#5a6b66]">
              {tags.length === 0
                ? "Nenhuma tag cadastrada."
                : `Nenhuma tag disponível para ${form.categoria}.`}
            </p>
          ) : (
            visibleTags.map((tag) => {
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

      <label className="mt-4 block text-sm font-semibold text-[#1a2e28]">
        Descrição curta
        <textarea value={form.descricao || ""} onChange={(e) => setForm({ ...form, descricao: e.target.value })} className="mt-1 min-h-20 w-full rounded-xl bg-[#f0f4f3] p-3 text-sm font-normal outline-none" />
      </label>

      <label className="mt-4 block text-sm font-semibold text-[#1a2e28]">
        Descrição longa
        <textarea value={form.descricao_longa || ""} onChange={(e) => setForm({ ...form, descricao_longa: e.target.value })} className="mt-1 min-h-24 w-full rounded-xl bg-[#f0f4f3] p-3 text-sm font-normal outline-none" />
      </label>

      <label className="mt-4 flex items-center gap-2 text-sm font-semibold text-[#1a2e28]">
        <input
          type="checkbox"
          checked={Boolean(form.mostrar_horarios)}
          onChange={(e) =>
            setForm({ ...form, mostrar_horarios: e.target.checked })
          }
        />
        Este local tem horário de funcionamento
      </label>

      {form.mostrar_horarios && (
        <div className="mt-2">
          <p className="text-sm font-semibold text-[#1a2e28]">Horários</p>
          <div className="mt-2">
            <HorarioEditor
              horarios={form.horarios}
              onChange={(horarios) => setForm({ ...form, horarios })}
            />
          </div>
        </div>
      )}

      <label className="mt-6 flex items-center gap-2 text-sm font-semibold text-[#1a2e28]">
        <input
          type="checkbox"
          checked={Boolean(form.mostrar_endereco)}
          onChange={(e) =>
            setForm({ ...form, mostrar_endereco: e.target.checked })
          }
        />
        Exibir endereço no app
      </label>

      <div className="mt-4">
        <p className="mb-2 text-sm font-semibold text-[#1a2e28]">
          Endereço estruturado
        </p>
        <EnderecoAutocomplete
          initialValue={localizacao}
          onSave={(value) => setLocalizacao(value)}
        />
      </div>

      <button disabled={saving} className="mt-5 rounded-xl bg-[#1a4a3a] px-5 py-3 text-sm font-semibold text-white disabled:opacity-60">
        {saving ? "Salvando..." : "Salvar local"}
      </button>
    </form>
  );
}
