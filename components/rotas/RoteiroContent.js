"use client";

import { formatRoteiroConteudo } from "@/lib/roteiroMarkdown";

/**
 * Renderiza o HTML formatado de um roteiro gerado por IA (markdown convertido).
 * @param {object} props
 * @param {string} props.conteudo - Texto markdown do roteiro.
 * @param {string} [props.className] - Classes adicionais no container.
 * @returns {import("react").JSX.Element|null}
 */
export default function RoteiroContent({ conteudo, className = "" }) {
  if (!conteudo) return null;

  return (
    <article
      className={`roteiro-content space-y-1 ${className}`}
      dangerouslySetInnerHTML={{ __html: formatRoteiroConteudo(conteudo) }}
    />
  );
}
