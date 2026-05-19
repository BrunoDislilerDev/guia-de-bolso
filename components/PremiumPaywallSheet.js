"use client";

import { PREMIUM_PRICE_LABEL } from "@/lib/premium";

const COPY = {
  busca: {
    title: "Busca com IA ilimitada",
    description:
      "Você atingiu o limite gratuito de buscas com IA este mês. Com o Premium, explore quantos lugares quiser com a ajuda da inteligência artificial.",
  },
  roteiro: {
    title: "Roteiros com IA ilimitados",
    description:
      "Você já criou seus roteiros gratuitos deste mês. Assine o Premium e monte quantos roteiros personalizados quiser para sua viagem.",
  },
  clima: {
    title: "Detalhes completos do clima",
    description:
      "Veja ondas nas próximas 24h, temperatura da água, índice UV, fase da lua e muito mais com o Guia Premium.",
  },
  geral: {
    title: "Guia Premium",
    description:
      "Desbloqueie busca com IA ilimitada, roteiros personalizados sem limite e detalhes completos do clima nas praias.",
  },
};

const BENEFITS = [
  "Busca com IA ilimitada",
  "Roteiros personalizados ilimitados",
  "Detalhes completos do clima e do mar",
];

export default function PremiumPaywallSheet({
  isOpen,
  onClose,
  feature = "geral",
  onLogin,
}) {
  if (!isOpen) return null;

  const copy = COPY[feature] ?? COPY.geral;

  return (
    <div
      className="fixed inset-0 z-[60] flex items-end bg-black/55 backdrop-blur-sm"
      onClick={onClose}
    >
      <style>{`
        @keyframes premiumSheetIn {
          from { transform: translateY(100%); }
          to { transform: translateY(0); }
        }
      `}</style>

      <div
        className="w-full rounded-t-[24px] bg-white px-6 pb-[max(1.75rem,env(safe-area-inset-bottom))] pt-3 shadow-2xl"
        onClick={(e) => e.stopPropagation()}
        style={{ animation: "premiumSheetIn 240ms ease-out forwards" }}
        role="dialog"
        aria-modal="true"
      >
        <div className="mx-auto mb-4 h-1.5 w-12 rounded-full bg-[#d8dfdc]" />

        <div className="text-center">
          <span className="text-3xl" aria-hidden>
            ✨
          </span>
          <h2 className="mt-2 text-xl font-bold text-[#1a2e28]">{copy.title}</h2>
          <p className="mt-2 text-sm leading-relaxed text-[#5a6b66]">
            {copy.description}
          </p>
        </div>

        <ul className="mt-5 space-y-2 rounded-2xl bg-[#f0f4f3] p-4 text-sm text-[#1a4a3a]">
          {BENEFITS.map((item) => (
            <li key={item} className="flex items-center gap-2">
              <span className="text-emerald-600" aria-hidden>
                ✓
              </span>
              {item}
            </li>
          ))}
        </ul>

        <p className="mt-4 text-center text-2xl font-bold text-[#1a4a3a]">
          {PREMIUM_PRICE_LABEL}
        </p>
        <p className="mt-1 text-center text-xs text-[#5a6b66]">
          Pagamento recorrente · Cancele quando quiser
        </p>

        <button
          type="button"
          className="mt-5 w-full rounded-xl bg-[#1a4a3a] py-3.5 text-sm font-semibold text-white"
          onClick={onClose}
        >
          Pagamento em breve
        </button>

        {onLogin && (
          <button
            type="button"
            onClick={() => {
              onClose();
              onLogin();
            }}
            className="mt-3 w-full py-2 text-sm font-medium text-[#1a4a3a]"
          >
            Fazer login
          </button>
        )}

        <button
          type="button"
          onClick={onClose}
          className="mt-2 w-full py-2 text-sm text-[#5a6b66]"
        >
          Agora não
        </button>
      </div>
    </div>
  );
}
