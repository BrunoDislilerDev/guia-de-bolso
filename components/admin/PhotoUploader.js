"use client";

import { useRef } from "react";
import { isAcceptedImageFile } from "@/lib/storageUpload";

const ACCEPT = "image/jpeg,image/png,image/webp";

/**
 * Upload múltiplo de fotos com preview, capa, remoção e mensagem de erro.
 * A primeira imagem da lista é a capa; use `onSetCover` para alterar.
 * @param {object} props
 * @param {string} [props.label="Fotos"] - Título da seção.
 * @param {Array<{ id: string, preview?: string, url?: string }>} [props.items=[]] - Itens existentes ou pendentes.
 * @param {(files: File[]) => void} props.onAddFiles - Callback com arquivos filtrados aceitos.
 * @param {(id: string) => void} props.onRemove - Remove item pelo id.
 * @param {(id: string) => void} [props.onSetCover] - Move item para a primeira posição (capa).
 * @param {boolean} [props.disabled=false] - Desabilita adicionar/remover durante save.
 * @param {string} [props.error=""] - Mensagem de erro abaixo do botão.
 * @returns {import("react").JSX.Element}
 */
export default function PhotoUploader({
  label = "Fotos",
  items = [],
  onAddFiles,
  onRemove,
  onSetCover,
  disabled = false,
  error = "",
}) {
  const inputRef = useRef(null);
  const coverId = items[0]?.id;

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
      <div className="mb-2 flex flex-wrap items-end justify-between gap-2">
        <p className="text-sm font-semibold text-[#1a2e28]">{label}</p>
        {items.length > 0 && (
          <p className="text-xs text-[#5a6b66]">
            A primeira foto é a capa. Toque em &quot;Usar como capa&quot; para trocar.
          </p>
        )}
      </div>

      {items.length > 0 && (
        <div className="mb-4 grid grid-cols-2 gap-3 sm:grid-cols-3">
          {items.map((item, index) => {
            const isCover = item.id === coverId;

            return (
              <article
                key={item.id}
                className={`relative overflow-hidden rounded-2xl bg-[#eef3f1] ${
                  isCover ? "ring-2 ring-[#1a4a3a] ring-offset-2" : ""
                }`}
              >
                <div className="aspect-[4/3] w-full">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={item.preview || item.url}
                    alt={isCover ? "Foto de capa" : `Foto ${index + 1}`}
                    className="h-full w-full object-cover"
                  />
                </div>

                {isCover ? (
                  <span className="absolute left-2 top-2 rounded-full bg-[#1a4a3a] px-2.5 py-1 text-[10px] font-bold uppercase tracking-wide text-white shadow-sm">
                    Capa
                  </span>
                ) : (
                  onSetCover && (
                    <button
                      type="button"
                      disabled={disabled}
                      onClick={() => onSetCover(item.id)}
                      className="absolute bottom-2 left-2 right-2 rounded-lg bg-white/95 px-2 py-1.5 text-[11px] font-semibold text-[#1a4a3a] shadow-sm backdrop-blur disabled:opacity-50"
                    >
                      Usar como capa
                    </button>
                  )
                )}

                <button
                  type="button"
                  disabled={disabled}
                  onClick={() => onRemove(item.id)}
                  className="absolute right-2 top-2 flex h-7 w-7 items-center justify-center rounded-full bg-black/70 text-sm font-bold text-white disabled:opacity-50"
                  aria-label="Remover foto"
                >
                  ×
                </button>
              </article>
            );
          })}
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
