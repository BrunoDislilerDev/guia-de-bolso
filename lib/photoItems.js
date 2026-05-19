export function createPhotoItemFromFile(file) {
  return {
    id: `pending-${crypto.randomUUID()}`,
    file,
    preview: URL.createObjectURL(file),
    existing: false,
  };
}

export function revokePhotoItemPreview(item) {
  if (item?.preview && !item.existing) {
    URL.revokeObjectURL(item.preview);
  }
}

export function getExistingUrlsFromPhotoItems(items) {
  return (items ?? [])
    .filter((item) => item.existing && item.url)
    .map((item) => item.url);
}

export function getPendingFilesFromPhotoItems(items) {
  return (items ?? []).filter((item) => item.file).map((item) => item.file);
}
