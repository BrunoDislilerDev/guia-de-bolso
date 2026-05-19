/** Bucket Supabase para fotos de lugares. */
export const LUGARES_FOTOS_BUCKET = "lugares-fotos";

/** Bucket Supabase para fotos de rotas. */
export const ROTAS_FOTOS_BUCKET = "rotas-fotos";

const ACCEPTED_TYPES = ["image/jpeg", "image/png", "image/webp"];

/**
 * Verifica se o arquivo é imagem aceita (JPEG, PNG ou WebP).
 * @param {File} file
 * @returns {boolean}
 */
export function isAcceptedImageFile(file) {
  return ACCEPTED_TYPES.includes(file.type);
}

/**
 * Sanitiza nome de arquivo para uso seguro no Storage.
 * @param {string} [name]
 * @returns {string}
 */
export function sanitizeStorageFileName(name) {
  const base = String(name || "foto")
    .replace(/\.[^.]+$/, "")
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-zA-Z0-9._-]/g, "-")
    .replace(/-+/g, "-")
    .replace(/^-|-$/g, "")
    .slice(0, 80);

  return base || "foto";
}

/**
 * Infere extensão do arquivo a partir do nome ou MIME type.
 * @param {File} file
 * @returns {'jpg'|'png'|'webp'}
 */
export function getFileExtension(file) {
  const fromName = file.name?.split(".").pop()?.toLowerCase();
  if (fromName && ["jpg", "jpeg", "png", "webp"].includes(fromName)) {
    return fromName === "jpeg" ? "jpg" : fromName;
  }
  if (file.type === "image/png") return "png";
  if (file.type === "image/webp") return "webp";
  return "jpg";
}

/**
 * Faz upload de uma foto para o bucket e retorna a URL pública.
 * @param {import('@supabase/supabase-js').SupabaseClient} supabase
 * @param {string} bucket - Nome do bucket (ex.: {@link LUGARES_FOTOS_BUCKET}).
 * @param {string} entityId - ID do lugar ou rota (prefixo do path).
 * @param {File} file
 * @returns {Promise<string>} URL pública da imagem.
 */
export async function uploadEntityPhoto(supabase, bucket, entityId, file) {
  const ext = getFileExtension(file);
  const safeName = sanitizeStorageFileName(file.name);
  const path = `${entityId}/${Date.now()}-${safeName}.${ext}`;

  const { error } = await supabase.storage.from(bucket).upload(path, file, {
    cacheControl: "3600",
    upsert: false,
    contentType: file.type || `image/${ext === "jpg" ? "jpeg" : ext}`,
  });

  if (error) throw error;

  const { data } = supabase.storage.from(bucket).getPublicUrl(path);
  return data.publicUrl;
}

/**
 * Faz upload sequencial de várias fotos.
 * @param {import('@supabase/supabase-js').SupabaseClient} supabase
 * @param {string} bucket
 * @param {string} entityId
 * @param {File[]} files
 * @returns {Promise<string[]>}
 */
export async function uploadEntityPhotos(supabase, bucket, entityId, files) {
  const urls = [];
  for (const file of files) {
    urls.push(await uploadEntityPhoto(supabase, bucket, entityId, file));
  }
  return urls;
}
