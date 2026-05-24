/**
 * Converte nome do lugar em slug URL-safe.
 * @param {unknown} nome
 * @returns {string}
 */
export function slugifyNome(nome) {
  return String(nome || "")
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 80);
}

/**
 * Garante slug único adicionando sufixo numérico se necessário.
 * @param {string} base
 * @param {Set<string>|string[]} takenSlugs
 * @param {string|null} [preferredExisting] - Slug atual do registro (não conta como colisão).
 * @returns {string}
 */
export function ensureUniqueSlug(base, takenSlugs, preferredExisting = null) {
  const taken = takenSlugs instanceof Set ? takenSlugs : new Set(takenSlugs);
  const normalizedBase = base || "local";

  if (!taken.has(normalizedBase) || normalizedBase === preferredExisting) {
    return normalizedBase;
  }

  let counter = 2;
  while (taken.has(`${normalizedBase}-${counter}`)) {
    counter += 1;
  }

  return `${normalizedBase}-${counter}`;
}

/**
 * Indica se o slug atual ainda reflete o nome (modo automático).
 * @param {string|null|undefined} slug
 * @param {string|null|undefined} nome
 * @returns {boolean}
 */
export function isSlugAutoFromNome(slug, nome) {
  if (!slug || !nome) return true;
  const base = slugifyNome(nome);
  if (!base) return true;
  if (slug === base) return true;
  return slug.startsWith(`${base}-`) && /-\d+$/.test(slug);
}

/**
 * Erro do PostgREST quando a coluna `lugares.slug` ainda não foi migrada.
 * @param {unknown} error
 * @returns {boolean}
 */
export function isMissingSlugColumnError(error) {
  const msg = String(error?.message || error || "").toLowerCase();
  return (
    msg.includes("slug") &&
    (msg.includes("does not exist") ||
      msg.includes("could not find") ||
      msg.includes("schema cache"))
  );
}

/**
 * Busca slugs já usados no banco.
 * @param {import("@supabase/supabase-js").SupabaseClient} supabase
 * @param {string|number|null} [excludeId]
 * @returns {Promise<{ taken: Set<string>, ready: boolean }>}
 */
export async function fetchTakenSlugs(supabase, excludeId = null) {
  const { data, error } = await supabase
    .from("lugares")
    .select("id, slug")
    .not("slug", "is", null);

  if (error) {
    if (isMissingSlugColumnError(error)) {
      return { taken: new Set(), ready: false };
    }
    console.error("[slug] fetchTakenSlugs:", error.message);
    return { taken: new Set(), ready: true };
  }

  return {
    taken: new Set(
      (data ?? [])
        .filter((row) => excludeId == null || String(row.id) !== String(excludeId))
        .map((row) => row.slug)
        .filter(Boolean)
    ),
    ready: true,
  };
}

/**
 * Resolve slug final para persistência.
 * @param {{
 *   nome: string,
 *   slugManual?: string|null,
 *   slugAuto?: boolean,
 *   lugarId?: string|number|null,
 *   takenSlugs: Set<string>,
 *   currentSlug?: string|null,
 * }} params
 * @returns {string|null}
 */
export function resolveLugarSlug({
  nome,
  slugManual,
  slugAuto = true,
  lugarId,
  takenSlugs,
  currentSlug = null,
}) {
  const base = slugifyNome(nome) || (lugarId != null ? `local-${lugarId}` : null);
  if (!base) return null;

  if (slugAuto) {
    return ensureUniqueSlug(base, takenSlugs, currentSlug);
  }

  const manual = slugifyNome(slugManual) || base;
  return ensureUniqueSlug(manual, takenSlugs, currentSlug);
}
