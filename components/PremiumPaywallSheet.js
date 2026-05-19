"use client";

import DailyLimitCountdown from "@/components/DailyLimitCountdown";
import { LIMITS, PREMIUM_PRICE_LABEL } from "@/lib/premium";

const COPY = {
  busca: {
    title: "Limite diário de buscas atingido",
    description: `Você usou suas ${LIMITS.busca} buscas com IA gratuitas de hoje. O limite reinicia automaticamente todo dia à meia-noite (horário de Brasília). Com o Premium, busque quantos lugares quiser, sem limite diário.`,
  },
  roteiro: {
    title: "Limite diário de roteiros atingido",
    description: `Você usou seus ${LIMITS.roteiro} roteiros com IA gratuitos de hoje. Amanhã você terá novos usos disponíveis — ou assine o Premium e crie roteiros ilimitados quando quiser.`,
  },
  clima: {
    title: "Detalhes completos do clima",
    description:
      "Veja ondas nas próximas 24h, temperatura da água, índice UV, fase da lua e muito mais com o Guia Premium.",
  },
  geral: {
    title: "Guia Premium — uso ilimitado",
    description:
      "No plano gratuito, buscas e roteiros com IA têm limite diário que reinicia todo dia. O Premium remove completamente esse limite.",
  },
};

const BENEFITS = [
  "Busca com IA ilimitada (sem limite diário)",
  "Roteiros personalizados ilimitados",
  "Detalhes completos do clima e do mar",
];

/**
 * PremiumPaywallSheet - Bottom sheet promoting Guia Premium when a daily limit is reached.
 * @param {object} props
 * @param {boolean} props.isOpen - Whether the sheet is visible.
 * @param {() => void} props.onClose - Called when the user dismisses the sheet.
 * @param {'busca'|'roteiro'|'clima'|'geral'} [props.feature] - Feature context for copy.
 * @param {() => void} [props.onLogin] - Optional handler to open login flow.
 * @param {boolean} [props.showCountdown=true] - Exibe contador até o reset diário.
 * @returns {import('react').ReactElement|null}
 */
export default function PremiumPaywallSheet({
  isOpen,
  onClose,
  feature = "geral",
  onLogin,
  showCountdown = true,
}) {
  if (!isOpen) return null;

  const copy = COPY[feature] ?? COPY.geral;
  const isLimitFeature = feature === "busca" || feature === "roteiro";

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
        aria-labelledby="premium-paywall-title"
      >
        <div className="mx-auto mb-4 h-1.5 w-12 rounded-full bg-[#d8dfdc]" />

        <div className="text-center">
          <span className="text-3xl" aria-hidden>
            ✨
          </span>
          <h2 id="premium-paywall-title" className="mt-2 text-xl font-bold text-[#1a2e28]">
            {copy.title}
          </h2>
          <p className="mt-2 text-sm leading-relaxed text-[#5a6b66]">{copy.description}</p>
        </div>

        {showCountdown && isLimitFeature && (
          <div className="mt-5">
            <DailyLimitCountdown />
          </div>
        )}

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

        <p className="mt-4 text-center text-xs leading-relaxed text-[#5a6b66]">
          Plano gratuito: até {LIMITS.busca} buscas e {LIMITS.roteiro} roteiros com IA por dia,
          renovados à meia-noite.
        </p>

        <p className="mt-4 text-center text-2xl font-bold text-[#1a4a3a]">
          {PREMIUM_PRICE_LABEL}
        </p>
        <p className="mt-1 text-center text-xs text-[#5a6b66]">
          Uso ilimitado · Pagamento recorrente · Cancele quando quiser
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
