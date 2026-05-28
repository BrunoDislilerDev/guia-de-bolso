"use client";

import { useEffect, useId } from "react";
import { useBottomSheetDrag } from "@/hooks/useBottomSheetDrag";

/**
 * Bottom sheet reutilizável na área de perfil (arrastar, overlay e Escape).
 * @param {object} props
 * @param {boolean} props.isOpen
 * @param {() => void} props.onClose
 * @param {string} props.title
 * @param {import("react").ReactNode} props.children
 * @returns {import("react").JSX.Element|null}
 */
export default function PerfilBottomSheet({ isOpen, onClose, title, children }) {
  const titleId = useId();
  const { sheetRef, scrollAreaRef, dragY, isDragging, sheetMotionStyle } = useBottomSheetDrag({
    isOpen,
    onClose,
  });

  useEffect(() => {
    if (!isOpen) return undefined;

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
      style={{ animation: "perfilOverlayIn 220ms ease-out forwards" }}
    >
      <style>{`
        @keyframes perfilOverlayIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }
        @keyframes perfilSheetIn {
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
            !isDragging && dragY === 0 ? "perfilSheetIn 260ms ease-out forwards" : undefined,
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

        <div ref={scrollAreaRef} className="min-h-0 flex-1 overflow-y-auto overscroll-contain px-5 pb-[max(1.5rem,env(safe-area-inset-bottom))]">
          <h2 id={titleId} className="mb-4 text-lg font-bold text-[#1a2e28]">
            {title}
          </h2>
          {children}
        </div>
      </div>
    </div>
  );
}
