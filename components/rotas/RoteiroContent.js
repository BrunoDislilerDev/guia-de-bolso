"use client";

import { formatRoteiroConteudo } from "@/lib/roteiroMarkdown";

export default function RoteiroContent({ conteudo, className = "" }) {
  if (!conteudo) return null;

  return (
    <article
      className={`roteiro-content space-y-1 ${className}`}
      dangerouslySetInnerHTML={{ __html: formatRoteiroConteudo(conteudo) }}
    />
  );
}
