import { truncateMetaDescription } from "@/lib/seo";

/**
 * Cabeçalho indexável no HTML inicial (um único h1 por página; UI usa h2).
 * @param {object} props
 * @param {string} props.nome
 * @param {string} [props.descricao]
 * @param {string} [props.categoria]
 * @returns {import('react').JSX.Element}
 */
export default function LugarSeoStatic({ nome, descricao, categoria }) {
  const texto = truncateMetaDescription(
    descricao || (categoria ? `${nome} — ${categoria} em Imbituba` : `${nome} em Imbituba`)
  );

  return (
    <header className="sr-only">
      <h1 className="font-display text-[28px] font-bold leading-[1.15] tracking-tight text-[#1a2e28]">
        {nome}
      </h1>
      {categoria ? (
        <p className="mt-1 text-xs font-semibold uppercase tracking-wide text-[#1a4a3a]/80">
          {categoria}
        </p>
      ) : null}
      <p className="mt-2 text-sm leading-relaxed text-[#5a6b66]">{texto}</p>
    </header>
  );
}
