/**
 * @typedef {{ id: string, file: File, preview: string, existing: false }} PendingPhotoItem
 */

/**
 * Cria item de foto pendente de upload a partir de um arquivo local.
 * @param {File} file
 * @returns {PendingPhotoItem}
 */
export function createPhotoItemFromFile(file) {
  return {
    id: `pending-${crypto.randomUUID()}`,
    file,
    preview: URL.createObjectURL(file),
    existing: false,
  };
}

/**
 * Libera URL de preview criada com `createObjectURL` para itens pendentes.
 * @param {{ preview?: string, existing?: boolean }} [item]
 * @returns {void}
 */
export function revokePhotoItemPreview(item) {
  if (item?.preview && !item.existing) {
    URL.revokeObjectURL(item.preview);
  }
}

/**
 * Extrai URLs já persistidas no storage dos itens do editor.
 * @param {Array<{ existing?: boolean, url?: string }>} [items]
 * @returns {string[]}
 */
export function getExistingUrlsFromPhotoItems(items) {
  return (items ?? [])
    .filter((item) => item.existing && item.url)
    .map((item) => item.url);
}

/**
 * Extrai arquivos pendentes de upload dos itens do editor.
 * @param {Array<{ file?: File }>} [items]
 * @returns {File[]}
 */
export function getPendingFilesFromPhotoItems(items) {
  return (items ?? []).filter((item) => item.file).map((item) => item.file);
}
