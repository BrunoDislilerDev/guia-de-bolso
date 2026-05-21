"use client";

import { LIMITS, PREMIUM_PRICE_LABEL } from "@/lib/premium";

/**
 * @param {object} props
 * @param {number} props.used
 * @param {number} props.limit
 * @param {string} props.label
 * @returns {import("react").JSX.Element}
 */
function UsageBar({ used, limit, label }) {
  const pct = limit > 0 ? Math.min(100, Math.round((used / limit) * 100)) : 0;

  return (
    <div>
      <div className="flex items-center justify-between text-xs">
        <span className="font-medium text-[#5a6b66]">{label}</span>
        <span className="font-semibold tabular-nums text-[#1a2e28]">
          {used}/{limit} hoje
        </span>
      </div>
      <div className="mt-1.5 h-2 overflow-hidden rounded-full bg-[#e8eeee]">
        <div
          className="h-full rounded-full bg-[#1a4a3a] transition-all"
          style={{ width: `${pct}%` }}
        />
      </div>
    </div>
  );
}

/**
 * Card de status Premium ou convite para assinar.
 * @param {object} props
 * @param {boolean} props.isPremium
 * @param {import("@/lib/premium").PremiumUsage|null} [props.usage]
 * @param {() => void} [props.onUpgrade]
 * @returns {import("react").JSX.Element}
 */
export default function PerfilPremiumCard({ isPremium, usage, onUpgrade }) {
  if (isPremium) {
    return (
      <section
        className="rounded-2xl bg-gradient-to-br from-[#f5e6b8] via-amber-50 to-[#f0e4d4] p-4 shadow-sm ring-1 ring-amber-200/60"
        aria-label="Plano Premium ativo"
      >
        <div className="flex items-start gap-3">
          <span className="text-2xl" aria-hidden>
            ✨
          </span>
          <div>
            <p className="text-sm font-bold text-[#7a6520]">Guia Premium ativo</p>
            <p className="mt-1 text-xs leading-relaxed text-[#6b5344]">
              Buscas e roteiros com IA ilimitados. Aproveite sem limites diários.
            </p>
          </div>
        </div>
      </section>
    );
  }

  const buscas = usage?.buscas ?? { used: 0, limit: LIMITS.busca };
  const roteiros = usage?.roteiros ?? { used: 0, limit: LIMITS.roteiro };

  return (
    <section className="rounded-2xl bg-white p-4 shadow-sm ring-1 ring-[#e8eeee]">
      <div className="flex items-start justify-between gap-3">
        <div>
          <p className="text-xs font-bold uppercase tracking-[0.1em] text-[#1a4a3a]">
            Plano gratuito
          </p>
          <p className="mt-1 text-sm font-bold text-[#1a2e28]">Uso de IA hoje</p>
          <p className="mt-0.5 text-xs text-[#5a6b66]">
            Renova à meia-noite (horário de Brasília)
          </p>
        </div>
        <span className="shrink-0 text-xl" aria-hidden>
          ✨
        </span>
      </div>

      <div className="mt-4 space-y-3">
        <UsageBar
          used={buscas.used}
          limit={buscas.limit}
          label="Buscas inteligentes"
        />
        <UsageBar
          used={roteiros.used}
          limit={roteiros.limit}
          label="Roteiros com IA"
        />
      </div>

      {onUpgrade && (
        <button
          type="button"
          onClick={onUpgrade}
          className="mt-4 w-full rounded-xl bg-[#1a4a3a] py-3 text-sm font-semibold text-white transition active:scale-[0.99]"
        >
          Conhecer Premium · {PREMIUM_PRICE_LABEL}
        </button>
      )}
    </section>
  );
}
