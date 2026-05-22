"use client";

import { useFeedback } from "@/components/FeedbackProvider";

/**
 * Alerta de erro com opção de reportar problema (Perfil → Ajuda e feedback).
 * @param {object} props
 * @param {string} props.message - Mensagem em português.
 * @param {import("react").ReactNode} [props.action] - Botão de retry, etc.
 * @param {boolean} [props.showReportHint] - Exibe link para reportar (default true).
 * @param {object} [props.reportContext] - Contexto técnico para o sheet.
 * @param {string} [props.className]
 * @returns {import("react").ReactElement}
 */
export default function UserErrorAlert({
  message,
  action,
  showReportHint = true,
  reportContext,
  className = "",
}) {
  const feedback = useFeedback();

  return (
    <div
      className={`rounded-xl border border-red-200 bg-red-50 p-4 text-sm text-red-800 ${className}`}
      role="alert"
    >
      <div className="flex gap-3">
        <svg
          className="mt-0.5 h-5 w-5 shrink-0 text-red-600"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          aria-hidden
        >
          <circle cx="12" cy="12" r="10" />
          <line x1="12" y1="8" x2="12" y2="12" />
          <line x1="12" y1="16" x2="12.01" y2="16" />
        </svg>
        <div className="min-w-0 flex-1">
          <p className="leading-relaxed">{message}</p>
          {action ? <div className="mt-3">{action}</div> : null}
          {showReportHint && feedback ? (
            <p className="mt-3 text-xs leading-relaxed text-red-700/90">
              Algo estranho aconteceu?{" "}
              <button
                type="button"
                onClick={() =>
                  feedback.openFeedback({
                    tipo: "erro",
                    mensagem: message,
                    contexto_tecnico: reportContext,
                  })
                }
                className="font-semibold text-[#1a4a3a] underline underline-offset-2"
              >
                Reportar este problema
              </button>{" "}
              em Perfil → Ajuda e feedback.
            </p>
          ) : null}
        </div>
      </div>
    </div>
  );
}
