"use client";

import PerfilBottomSheet from "@/components/perfil/PerfilBottomSheet";

/**
 * Confirmação de logout com copy e botões acessíveis (44px).
 * @param {object} props
 * @param {boolean} props.isOpen
 * @param {() => void} props.onClose
 * @param {() => void} props.onConfirm
 * @returns {import("react").JSX.Element}
 */
export default function PerfilLogoutSheet({ isOpen, onClose, onConfirm }) {
  return (
    <PerfilBottomSheet isOpen={isOpen} onClose={onClose} title="Sair da conta">
      <div className="flex items-start gap-3 rounded-2xl bg-[#f7faf9] px-4 py-3 ring-1 ring-[#e8eeee]">
        <span
          className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-[#e8f0ed] text-xl"
          aria-hidden
        >
          👋
        </span>
        <p className="text-sm leading-relaxed text-[#5a6b66]">
          Você pode entrar de novo quando quiser com Google ou SMS. Seus favoritos e
          preferências ficam salvos na sua conta.
        </p>
      </div>

      <button
        type="button"
        onClick={onClose}
        className="mt-5 w-full min-h-[44px] rounded-xl bg-[#f0f4f3] py-3.5 text-sm font-semibold text-[#5a6b66] transition active:scale-[0.99]"
      >
        Cancelar
      </button>
      <button
        type="button"
        onClick={onConfirm}
        className="mt-3 w-full min-h-[44px] rounded-xl border-2 border-red-200 bg-red-50 py-3.5 text-sm font-semibold text-red-800 transition active:scale-[0.99] hover:bg-red-100/80"
      >
        Sair
      </button>
    </PerfilBottomSheet>
  );
}
