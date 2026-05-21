import { CATEGORIAS_EXPLORE } from "@/lib/categorias";
import { tagAplicaEmRota } from "@/lib/tags";

/** Nomes de categorias fixas (Explorar + LocalForm). */
export const CATEGORIAS_TAXONOMIA = CATEGORIAS_EXPLORE.map((item) => item.nome);

/**
 * @param {import("@supabase/supabase-js").PostgrestError|null|undefined} error
 * @returns {boolean}
 */
function isAplicaEmRotasColumnError(error) {
  const msg = error?.message || "";
  return msg.includes("aplica_em_rotas");
}

/**
 * @param {object} tag
 * @param {boolean} [useColumn=true]
 * @returns {object}
 */
export function enrichTagRow(tag, useColumn = true) {
  return {
    ...tag,
    categorias: normalizeCategoriasJson(tag.categorias),
    aplica_em_rotas: useColumn
      ? Boolean(tag.aplica_em_rotas)
      : tagAplicaEmRota(tag),
  };
}

/**
 * @param {{ nome: string, icone?: string, categorias: string[], aplica_em_rotas?: boolean }} payload
 * @returns {object}
 */
function buildTagPayload(payload) {
  return {
    nome: payload.nome?.trim(),
    icone: payload.icone?.trim() || null,
    categorias: payload.categorias?.length ? payload.categorias : [],
    aplica_em_rotas: Boolean(payload.aplica_em_rotas),
  };
}

/**
 * @param {import("@supabase/supabase-js").SupabaseClient} supabase
 * @returns {Promise<object[]>}
 */
export async function fetchSubcategoriasAdmin(supabase) {
  const { data, error } = await supabase
    .from("subcategorias")
    .select("id, categoria, nome, icone")
    .order("categoria")
    .order("nome");

  if (error) {
    console.error("[fetchSubcategoriasAdmin]", error.message);
    return [];
  }

  return data ?? [];
}

/**
 * @param {import("@supabase/supabase-js").SupabaseClient} supabase
 * @param {string} categoria
 * @param {string} nome
 * @returns {Promise<number>}
 */
export async function countLugaresComSubcategoria(supabase, categoria, nome) {
  const { count, error } = await supabase
    .from("lugares")
    .select("id", { count: "exact", head: true })
    .eq("categoria", categoria)
    .eq("subcategoria", nome);

  if (error) {
    console.error("[countLugaresComSubcategoria]", error.message);
    return 0;
  }

  return count ?? 0;
}

/**
 * @param {import("@supabase/supabase-js").SupabaseClient} supabase
 * @param {string} categoria
 * @param {string} nomeAntigo
 * @param {string} nomeNovo
 * @returns {Promise<{ error: import("@supabase/supabase-js").PostgrestError|null }>}
 */
export async function migrarLugaresSubcategoria(supabase, categoria, nomeAntigo, nomeNovo) {
  return supabase
    .from("lugares")
    .update({ subcategoria: nomeNovo })
    .eq("categoria", categoria)
    .eq("subcategoria", nomeAntigo);
}

/**
 * @param {import("@supabase/supabase-js").SupabaseClient} supabase
 * @param {{ categoria: string, nome: string, icone?: string }} payload
 * @returns {Promise<{ data: object|null, error: string|null }>}
 */
export async function createSubcategoriaAdmin(supabase, payload) {
  const nome = payload.nome?.trim();
  const categoria = payload.categoria?.trim();

  if (!categoria || !nome) {
    return { data: null, error: "Categoria e nome são obrigatórios." };
  }

  const { data: existing } = await supabase
    .from("subcategorias")
    .select("id")
    .eq("categoria", categoria)
    .eq("nome", nome)
    .maybeSingle();

  if (existing) {
    return { data: null, error: "Já existe uma subcategoria com este nome nesta categoria." };
  }

  const { data, error } = await supabase
    .from("subcategorias")
    .insert({
      categoria,
      nome,
      icone: payload.icone?.trim() || null,
    })
    .select()
    .single();

  if (error) return { data: null, error: error.message };
  return { data, error: null };
}

/**
 * @param {import("@supabase/supabase-js").SupabaseClient} supabase
 * @param {string|number} id
 * @param {{ categoria: string, nome: string, icone?: string, nomeAntigo?: string, migrarLugares?: boolean }} payload
 * @returns {Promise<{ data: object|null, error: string|null }>}
 */
export async function updateSubcategoriaAdmin(supabase, id, payload) {
  const nome = payload.nome?.trim();
  const categoria = payload.categoria?.trim();
  const nomeAntigo = payload.nomeAntigo?.trim();

  if (!categoria || !nome) {
    return { data: null, error: "Categoria e nome são obrigatórios." };
  }

  if (nomeAntigo && nomeAntigo !== nome) {
    const { data: duplicate } = await supabase
      .from("subcategorias")
      .select("id")
      .eq("categoria", categoria)
      .eq("nome", nome)
      .neq("id", id)
      .maybeSingle();

    if (duplicate) {
      return { data: null, error: "Já existe uma subcategoria com este nome nesta categoria." };
    }
  }

  const { data, error } = await supabase
    .from("subcategorias")
    .update({
      categoria,
      nome,
      icone: payload.icone?.trim() || null,
    })
    .eq("id", id)
    .select()
    .single();

  if (error) return { data: null, error: error.message };

  if (
    payload.migrarLugares &&
    nomeAntigo &&
    nomeAntigo !== nome &&
    payload.categoriaAntiga === categoria
  ) {
    const { error: migError } = await migrarLugaresSubcategoria(
      supabase,
      categoria,
      nomeAntigo,
      nome
    );
    if (migError) {
      return {
        data,
        error: `Subcategoria salva, mas falha ao migrar lugares: ${migError.message}`,
      };
    }
  } else if (
    payload.migrarLugares &&
    nomeAntigo &&
    payload.categoriaAntiga &&
    payload.categoriaAntiga !== categoria
  ) {
    const { error: migError } = await supabase
      .from("lugares")
      .update({ subcategoria: nome, categoria })
      .eq("categoria", payload.categoriaAntiga)
      .eq("subcategoria", nomeAntigo);

    if (migError) {
      return {
        data,
        error: `Subcategoria salva, mas falha ao migrar lugares: ${migError.message}`,
      };
    }
  }

  return { data, error: null };
}

/**
 * @param {import("@supabase/supabase-js").SupabaseClient} supabase
 * @param {object} sub
 * @returns {Promise<{ ok: boolean, error: string|null }>}
 */
export async function deleteSubcategoriaAdmin(supabase, sub) {
  const uso = await countLugaresComSubcategoria(supabase, sub.categoria, sub.nome);

  if (uso > 0) {
    return {
      ok: false,
      error: `Não é possível excluir: ${uso} local(is) usam esta subcategoria.`,
    };
  }

  const { error } = await supabase.from("subcategorias").delete().eq("id", sub.id);

  if (error) return { ok: false, error: error.message };
  return { ok: true, error: null };
}

/**
 * @param {import("@supabase/supabase-js").SupabaseClient} supabase
 * @returns {Promise<object[]>}
 */
export async function fetchTagsAdmin(supabase) {
  const { data, error } = await supabase
    .from("tags")
    .select("id, nome, icone, categorias, aplica_em_rotas")
    .order("nome");

  if (!error) {
    return (data ?? []).map((tag) => enrichTagRow(tag, true));
  }

  if (isAplicaEmRotasColumnError(error)) {
    const fallback = await supabase
      .from("tags")
      .select("id, nome, icone, categorias")
      .order("nome");

    if (fallback.error) {
      console.error("[fetchTagsAdmin]", fallback.error.message);
      return [];
    }

    return (fallback.data ?? []).map((tag) => enrichTagRow(tag, false));
  }

  console.error("[fetchTagsAdmin]", error.message);
  return [];
}

/**
 * @param {unknown} value
 * @returns {string[]}
 */
export function normalizeCategoriasJson(value) {
  if (!value) return [];
  if (Array.isArray(value)) return value.filter((item) => typeof item === "string");
  return [];
}

/**
 * @param {import("@supabase/supabase-js").SupabaseClient} supabase
 * @param {number|string} tagId
 * @returns {Promise<{ lugares: number, rotas: number }>}
 */
export async function countTagUsage(supabase, tagId) {
  const [lugaresRes, rotasRes] = await Promise.all([
    supabase
      .from("lugares_tags")
      .select("id", { count: "exact", head: true })
      .eq("tag_id", tagId),
    supabase
      .from("rotas_tags")
      .select("id", { count: "exact", head: true })
      .eq("tag_id", tagId),
  ]);

  return {
    lugares: lugaresRes.error ? 0 : (lugaresRes.count ?? 0),
    rotas: rotasRes.error ? 0 : (rotasRes.count ?? 0),
  };
}

/**
 * @param {import("@supabase/supabase-js").SupabaseClient} supabase
 * @param {{ nome: string, icone?: string, categorias: string[], aplica_em_rotas?: boolean }} payload
 * @returns {Promise<{ data: object|null, error: string|null }>}
 */
export async function createTagAdmin(supabase, payload) {
  const row = buildTagPayload(payload);

  if (!row.nome) {
    return { data: null, error: "Nome da tag é obrigatório." };
  }

  if (!row.categorias.length && !row.aplica_em_rotas) {
    return {
      data: null,
      error: "Selecione ao menos uma categoria ou marque “Aplica em rotas”.",
    };
  }

  let { data, error } = await supabase.from("tags").insert(row).select().single();

  if (error && isAplicaEmRotasColumnError(error)) {
    const { aplica_em_rotas: _flag, ...rowSemRotas } = row;
    ({ data, error } = await supabase.from("tags").insert(rowSemRotas).select().single());
    if (!error) {
      return { data: enrichTagRow(data, false), error: null };
    }
  }

  if (error) return { data: null, error: error.message };
  return { data: enrichTagRow(data, true), error: null };
}

/**
 * @param {import("@supabase/supabase-js").SupabaseClient} supabase
 * @param {number|string} id
 * @param {{ nome: string, icone?: string, categorias: string[], aplica_em_rotas?: boolean }} payload
 * @returns {Promise<{ data: object|null, error: string|null }>}
 */
export async function updateTagAdmin(supabase, id, payload) {
  const row = buildTagPayload(payload);

  if (!row.nome) {
    return { data: null, error: "Nome da tag é obrigatório." };
  }

  if (!row.categorias.length && !row.aplica_em_rotas) {
    return {
      data: null,
      error: "Selecione ao menos uma categoria ou marque “Aplica em rotas”.",
    };
  }

  let { data, error } = await supabase
    .from("tags")
    .update(row)
    .eq("id", id)
    .select()
    .single();

  if (error && isAplicaEmRotasColumnError(error)) {
    const { aplica_em_rotas: _flag, ...rowSemRotas } = row;
    ({ data, error } = await supabase
      .from("tags")
      .update(rowSemRotas)
      .eq("id", id)
      .select()
      .single());
    if (!error) {
      return { data: enrichTagRow(data, false), error: null };
    }
  }

  if (error) return { data: null, error: error.message };
  return { data: enrichTagRow(data, true), error: null };
}

/**
 * @param {import("@supabase/supabase-js").SupabaseClient} supabase
 * @param {object} tag
 * @returns {Promise<{ ok: boolean, error: string|null }>}
 */
export async function deleteTagAdmin(supabase, tag) {
  const uso = await countTagUsage(supabase, tag.id);
  const total = uso.lugares + uso.rotas;

  if (total > 0) {
    const partes = [];
    if (uso.lugares > 0) partes.push(`${uso.lugares} local(is)`);
    if (uso.rotas > 0) partes.push(`${uso.rotas} rota(s)`);
    return {
      ok: false,
      error: `Não é possível excluir: tag em uso em ${partes.join(" e ")}.`,
    };
  }

  const { error } = await supabase.from("tags").delete().eq("id", tag.id);

  if (error) return { ok: false, error: error.message };
  return { ok: true, error: null };
}

/**
 * @param {string[]} categorias
 * @returns {string}
 */
export function formatCategoriasLabel(categorias) {
  if (!categorias?.length) return "Sem categoria";
  if (categorias.length <= 2) return categorias.join(", ");
  return `${categorias.slice(0, 2).join(", ")} +${categorias.length - 2}`;
}

/**
 * @param {import("@supabase/supabase-js").SupabaseClient} supabase
 * @returns {Promise<Map<string, number>>}
 */
export async function fetchSubcategoriaUsageMap(supabase) {
  const { data, error } = await supabase
    .from("lugares")
    .select("categoria, subcategoria")
    .not("subcategoria", "is", null);

  const map = new Map();

  if (error) {
    console.error("[fetchSubcategoriaUsageMap]", error.message);
    return map;
  }

  for (const row of data ?? []) {
    const sub = String(row.subcategoria || "").trim();
    if (!sub) continue;
    const key = `${row.categoria}::${sub}`;
    map.set(key, (map.get(key) || 0) + 1);
  }

  return map;
}

/**
 * @param {import("@supabase/supabase-js").SupabaseClient} supabase
 * @returns {Promise<Map<string|number, { lugares: number, rotas: number }>>}
 */
export async function fetchTagUsageMap(supabase) {
  const [lugaresRes, rotasRes] = await Promise.all([
    supabase.from("lugares_tags").select("tag_id"),
    supabase.from("rotas_tags").select("tag_id"),
  ]);

  const map = new Map();

  for (const row of lugaresRes.data ?? []) {
    const id = row.tag_id;
    const current = map.get(id) || { lugares: 0, rotas: 0 };
    map.set(id, { ...current, lugares: current.lugares + 1 });
  }

  if (!rotasRes.error) {
    for (const row of rotasRes.data ?? []) {
      const id = row.tag_id;
      const current = map.get(id) || { lugares: 0, rotas: 0 };
      map.set(id, { ...current, rotas: current.rotas + 1 });
    }
  }

  return map;
}
