"use client";

import { useRef } from "react";
import { isAcceptedImageFile } from "@/lib/storageUpload";

const ACCEPT = "image/jpeg,image/png,image/webp";

/**
 * Upload múltiplo de fotos com preview, remoção e mensagem de erro.
 * @param {object} props
 * @param {string} [props.label="Fotos"] - Título da seção.
 * @param {Array<{ id: string, preview?: string, url?: string }>} [props.items=[]] - Itens existentes ou pendentes.
 * @param {(files: File[]) => void} props.onAddFiles - Callback com arquivos filtrados aceitos.
 * @param {(id: string) => void} props.onRemove - Remove item pelo id.
 * @param {boolean} [props.disabled=false] - Desabilita adicionar/remover durante save.
 * @param {string} [props.error=""] - Mensagem de erro abaixo do botão.
 * @returns {import("react").JSX.Element}
 */
export default function PhotoUploader({
  label = "Fotos",
  items = [],
  onAddFiles,
  onRemove,
  disabled = false,
  error = "",
}) {
  const inputRef = useRef(null);

  /**
   * Repassa arquivos válidos ao pai e limpa o input para permitir reenvio do mesmo arquivo.
   * @param {import("react").ChangeEvent<HTMLInputElement>} event - Change do input file.
   */
  function handleFileChange(event) {
    const files = Array.from(event.target.files || []).filter(isAcceptedImageFile);
    if (files.length > 0) onAddFiles(files);
    event.target.value = "";
  }

  return (
    <div className="mt-4">
      <p className="mb-2 text-sm font-semibold text-[#1a2e28]">{label}</p>

      {items.length > 0 && (
        <div className="mb-3 flex flex-wrap gap-2">
          {items.map((item) => (
            <div
              key={item.id}
              className="relative h-20 w-20 shrink-0 overflow-hidden rounded-xl bg-[#eef3f1]"
            >
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={item.preview || item.url}
                alt="Pré-visualização da foto"
                className="h-full w-full object-cover"
              />
              <button
                type="button"
                disabled={disabled}
                onClick={() => onRemove(item.id)}
                className="absolute right-0.5 top-0.5 flex h-5 w-5 items-center justify-center rounded-full bg-black/70 text-xs font-bold text-white disabled:opacity-50"
                aria-label="Remover foto"
              >
                ×
              </button>
            </div>
          ))}
        </div>
      )}

      <input
        ref={inputRef}
        type="file"
        accept={ACCEPT}
        multiple
        className="hidden"
        disabled={disabled}
        onChange={handleFileChange}
      />

      <button
        type="button"
        disabled={disabled}
        onClick={() => inputRef.current?.click()}
        className="rounded-xl border border-dashed border-[#1a4a3a]/30 bg-[#f7faf9] px-4 py-2 text-sm font-semibold text-[#1a4a3a] disabled:opacity-60"
      >
        Adicionar fotos
      </button>

      <p className="mt-1 text-xs text-[#5a6b66]">JPG, PNG ou WebP. Múltiplos arquivos.</p>
      {error && <p className="mt-1 text-xs font-semibold text-[#d9534f]">{error}</p>}
    </div>
  );
}
