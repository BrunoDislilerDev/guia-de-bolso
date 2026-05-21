"use client";

import { useEffect, useId } from "react";

/**
 * Bottom sheet reutilizável na área de perfil.
 * @param {object} props
 * @param {boolean} props.isOpen
 * @param {() => void} props.onClose
 * @param {string} props.title
 * @param {import("react").ReactNode} props.children
 * @returns {import("react").JSX.Element|null}
 */
export default function PerfilBottomSheet({ isOpen, onClose, title, children }) {
  const titleId = useId();

  useEffect(() => {
    if (!isOpen) return undefined;

    function handleEscape(event) {
      if (event.key === "Escape") onClose();
    }

    window.addEventListener("keydown", handleEscape);
    return () => window.removeEventListener("keydown", handleEscape);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-end bg-black/55 backdrop-blur-sm"
      onClick={onClose}
    >
      <div
        className="w-full rounded-t-[24px] bg-white px-5 pb-[max(1.5rem,env(safe-area-inset-bottom))] pt-3 shadow-2xl"
        onClick={(event) => event.stopPropagation()}
        style={{ animation: "perfilSheetIn 240ms ease-out" }}
        role="dialog"
        aria-modal="true"
        aria-labelledby={titleId}
      >
        <style>{`
          @keyframes perfilSheetIn {
            from { transform: translateY(100%); }
            to { transform: translateY(0); }
          }
        `}</style>
        <div className="mx-auto mb-5 h-1.5 w-12 rounded-full bg-[#d8dfdc]" />
        <h2 id={titleId} className="mb-4 text-lg font-bold text-[#1a2e28]">
          {title}
        </h2>
        {children}
      </div>
    </div>
  );
}
