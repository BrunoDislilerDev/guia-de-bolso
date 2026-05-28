"use client";

import { useEffect, useId, useState } from "react";
import { useBottomSheetDrag } from "@/hooks/useBottomSheetDrag";
import { NAV_APPS, getNavAppSubtitle } from "@/lib/navApps";

/**
 * Sheet para escolher app de navegação (IR AGORA / abrir rota).
 * @param {object} props
 * @param {boolean} props.isOpen
 * @param {() => void} props.onClose
 * @param {(appKey: string, remember: boolean) => void} props.onSelect
 * @param {string} [props.preferredKey] - App preferido (localStorage ou perfil).
 * @param {string} [props.title="Abrir rota com"]
 * @returns {import("react").JSX.Element|null}
 */
export default function NavigationAppSheet({
  isOpen,
  onClose,
  onSelect,
  preferredKey,
  title = "Abrir rota com",
}) {
  const titleId = useId();
  const [rememberChoice, setRememberChoice] = useState(true);
  const { sheetRef, scrollAreaRef, dragY, isDragging, sheetMotionStyle } = useBottomSheetDrag({
    isOpen,
    onClose,
  });

  useEffect(() => {
    if (!isOpen) return undefined;

    setRememberChoice(true);

    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    function handleEscape(event) {
      if (event.key === "Escape") onClose();
    }

    window.addEventListener("keydown", handleEscape);

    return () => {
      document.body.style.overflow = previousOverflow;
      window.removeEventListener("keydown", handleEscape);
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-end bg-black/55 backdrop-blur-sm"
      onClick={onClose}
      style={{ animation: "navOverlayIn 220ms ease-out forwards" }}
    >
      <style>{`
        @keyframes navOverlayIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }
        @keyframes navSheetIn {
          from { transform: translateY(100%); }
          to { transform: translateY(0); }
        }
      `}</style>

      <div
        ref={sheetRef}
        className="flex max-h-[90vh] w-full max-w-md flex-col rounded-t-[24px] bg-white shadow-2xl"
        onClick={(event) => event.stopPropagation()}
        style={{
          animation:
            !isDragging && dragY === 0 ? "navSheetIn 260ms ease-out forwards" : undefined,
          ...sheetMotionStyle,
        }}
        role="dialog"
        aria-modal="true"
        aria-labelledby={titleId}
      >
        <div
          data-drag-handle="true"
          className="flex shrink-0 cursor-grab flex-col items-center px-5 pt-2 active:cursor-grabbing"
          aria-hidden
        >
          <span className="h-1.5 w-12 rounded-full bg-[#d8dfdc]" />
          <span className="mt-2 h-4 w-full max-w-[120px] rounded-full bg-transparent" />
        </div>

        <div
          ref={scrollAreaRef}
          className="min-h-0 flex-1 overflow-y-auto overscroll-contain px-5 pb-[max(1.5rem,env(safe-area-inset-bottom))]"
        >
          <h2 id={titleId} className="mb-1 text-lg font-bold text-[#1a2e28]">
            {title}
          </h2>
          <p className="mb-4 text-sm text-[#5a6b66]">
            Escolha o app para traçar a rota até o destino.
          </p>

          <div className="space-y-2">
            {NAV_APPS.map((app) => {
              const isPreferred = app.key === preferredKey;
              return (
                <button
                  key={app.key}
                  type="button"
                  onClick={() => onSelect(app.key, rememberChoice)}
                  className={`flex min-h-[52px] w-full items-center gap-3 rounded-2xl px-4 py-3.5 text-left ring-1 transition active:scale-[0.99] ${
                    isPreferred
                      ? "bg-[#e8f5f0] ring-[#1a4a3a]/35"
                      : "bg-white ring-[#e8eeee] hover:bg-[#f7faf9] hover:ring-[#1a4a3a]/20"
                  }`}
                >
                  <span
                    className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-[#f0f4f3] text-xl"
                    aria-hidden
                  >
                    {app.emoji}
                  </span>
                  <span className="min-w-0 flex-1">
                    <span className="flex flex-wrap items-center gap-2">
                      <span className="font-semibold text-[#1a2e28]">{app.label}</span>
                      {isPreferred && (
                        <span className="rounded-full bg-[#1a4a3a] px-2 py-0.5 text-[10px] font-bold uppercase tracking-wide text-white">
                          Preferido
                        </span>
                      )}
                    </span>
                    <span className="mt-0.5 block text-xs text-[#5a6b66]">
                      {getNavAppSubtitle(app.key)}
                    </span>
                  </span>
                  <span className="shrink-0 text-[#1a4a3a]" aria-hidden>
                    →
                  </span>
                </button>
              );
            })}
          </div>

          <label className="mt-4 flex min-h-[44px] cursor-pointer items-center gap-3 rounded-xl bg-[#f7faf9] px-3 py-2.5 ring-1 ring-[#e8eeee]">
            <input
              type="checkbox"
              checked={rememberChoice}
              onChange={(event) => setRememberChoice(event.target.checked)}
              className="h-4 w-4 rounded border-[#c5d5cf] text-[#1a4a3a] focus:ring-[#1a4a3a]/30"
            />
            <span className="text-sm font-medium text-[#1a2e28]">
              Lembrar minha escolha
            </span>
          </label>

          <button
            type="button"
            onClick={onClose}
            className="mt-3 w-full min-h-[44px] rounded-xl py-3 text-sm font-semibold text-[#5a6b66]"
          >
            Cancelar
          </button>
        </div>
      </div>
    </div>
  );
}
