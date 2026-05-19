"use client";

import { useEffect, useState } from "react";
import { formatCountdown, getMsUntilDailyReset } from "@/lib/premium";

/**
 * DailyLimitCountdown - Contador regressivo até a meia-noite (fuso São Paulo).
 * @param {object} props
 * @param {string} [props.className] - Classes do texto do timer.
 * @param {string} [props.prefix] - Texto antes do horário.
 * @param {boolean} [props.compact] - Layout mais compacto.
 * @param {number} [props.initialMs] - Milissegundos iniciais (ex.: de `usage.msUntilReset`).
 * @param {string} [props.timerClassName] - Classes do valor do timer (modo compact).
 * @returns {import('react').ReactElement}
 */
export default function DailyLimitCountdown({
  className = "",
  prefix = "Você poderá usar novamente em",
  compact = false,
  initialMs,
  timerClassName = "",
}) {
  const [remainingMs, setRemainingMs] = useState(() =>
    typeof initialMs === "number" ? initialMs : getMsUntilDailyReset()
  );

  useEffect(() => {
    const tick = () => setRemainingMs(getMsUntilDailyReset());
    tick();
    const interval = setInterval(tick, 1000);
    return () => clearInterval(interval);
  }, []);

  const formatted = formatCountdown(remainingMs);

  if (compact) {
    const timerClasses =
      timerClassName ||
      (className ? "text-inherit" : "text-[#1a4a3a]");

    return (
      <p className={className}>
        {prefix}{" "}
        <span className={`font-mono font-bold tabular-nums ${timerClasses}`}>
          {formatted}
        </span>
      </p>
    );
  }

  return (
    <div
      className={`rounded-2xl border border-[#d4ede8] bg-[#f0f4f3] px-4 py-3 text-center ${className}`}
    >
      <p className="text-xs font-medium text-[#5a6b66]">{prefix}</p>
      <p className="mt-1 font-mono text-2xl font-bold tabular-nums tracking-wide text-[#1a4a3a]">
        {formatted}
      </p>
      <p className="mt-1 text-[11px] text-[#5a6b66]">
        O limite gratuito reinicia todo dia à meia-noite
      </p>
    </div>
  );
}
