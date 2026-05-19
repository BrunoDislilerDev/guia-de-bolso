"use client";

function IconPhone({ className = "h-5 w-5" }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="currentColor" aria-hidden>
      <path d="M6.62 10.79a15.05 15.05 0 006.59 6.59l2.2-2.2a1 1 0 011.01-.24c1.12.37 2.33.57 3.58.57a1 1 0 011 1V20a1 1 0 01-1 1C10.61 21 3 13.39 3 4a1 1 0 011-1h3.5a1 1 0 011 1c0 1.25.2 2.46.57 3.58a1 1 0 01-.25 1.01l-2.2 2.2z" />
    </svg>
  );
}

function IconInstagram({ className = "h-5 w-5" }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="currentColor" aria-hidden>
      <path d="M7 2h10a5 5 0 015 5v10a5 5 0 01-5 5H7a5 5 0 01-5-5V7a5 5 0 015-5zm10 2H7a3 3 0 00-3 3v10a3 3 0 003 3h10a3 3 0 003-3V7a3 3 0 00-3-3zm-5 3.5A4.5 4.5 0 1112 16a4.5 4.5 0 010-9zm0 2A2.5 2.5 0 1014.5 12 2.5 2.5 0 0012 9.5zM17.75 6.25a1 1 0 11-1 1 1 1 0 011-1z" />
    </svg>
  );
}

function IconUtensils({ className = "h-5 w-5" }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="currentColor" aria-hidden>
      <path d="M8.1 13.34l2.83-2.83L3.91 3.5a4.008 4.008 0 000 5.66l4.19 4.18zm6.78-1.81c1.53.71 3.68.21 5.27-1.38 1.91-1.91 2.28-4.65.81-6.12-1.46-1.46-4.2-1.1-6.12.81-1.59 1.59-2.09 3.74-1.38 5.27L3.7 19.87l1.41 1.41L12 14.41l6.88 6.88 1.41-1.41L13.41 13l1.47-1.47z" />
    </svg>
  );
}

function IconGlobe({ className = "h-5 w-5" }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="currentColor" aria-hidden>
      <path d="M12 2a10 10 0 100 20 10 10 0 000-20zm6.93 6h-2.95a15.6 15.6 0 00-1.2-3.1A8.03 8.03 0 0118.93 8zM12 4.04A13.8 13.8 0 0113.91 8h-3.82A13.8 13.8 0 0112 4.04zM4.26 14a8.18 8.18 0 010-4h3.38A16.47 16.47 0 007.5 12c0 .69.05 1.36.14 2H4.26zm.81 2h2.95c.3 1.13.7 2.18 1.2 3.1A8.03 8.03 0 015.07 16zm2.95-8H5.07a8.03 8.03 0 014.15-3.1A15.6 15.6 0 008.02 8zM12 19.96A13.8 13.8 0 0110.09 16h3.82A13.8 13.8 0 0112 19.96zM14.34 14H9.66A14.84 14.84 0 019.5 12c0-.69.06-1.36.16-2h4.68c.1.64.16 1.31.16 2s-.06 1.36-.16 2zm.44 5.1c.5-.92.9-1.97 1.2-3.1h2.95a8.03 8.03 0 01-4.15 3.1zM16.36 14c.09-.64.14-1.31.14-2s-.05-1.36-.14-2h3.38a8.18 8.18 0 010 4h-3.38z" />
    </svg>
  );
}

const ICONS_ESTABELECIMENTO = {
  ligar: IconPhone,
  instagram: IconInstagram,
  cardapio: IconUtensils,
  site: IconGlobe,
};

function BotaoEstabelecimento({ label, href, Icon }) {
  const content = (
    <>
      <Icon />
      <span className="text-xs font-medium">{label}</span>
    </>
  );

  const className = `flex w-[4.5rem] flex-col items-center gap-2 rounded-2xl px-2 py-3 text-[#1a4a3a] ${
    href
      ? "bg-white shadow-sm ring-1 ring-[#e3ebe7] transition-transform active:scale-95"
      : "bg-white/60 opacity-40 ring-1 ring-[#e3ebe7]/60"
  }`;

  if (!href) {
    return (
      <button type="button" disabled className={className} aria-label={`${label} indisponível`}>
        {content}
      </button>
    );
  }

  return (
    <a href={href} target="_blank" rel="noopener noreferrer" className={className}>
      {content}
    </a>
  );
}

function ChipPublico({ acao }) {
  return (
    <div
      className="flex min-w-[5.5rem] max-w-[9.5rem] shrink-0 snap-start flex-col items-center gap-1.5 rounded-2xl bg-white px-3 py-3 text-[#1a4a3a] shadow-sm ring-1 ring-[#e3ebe7]"
      role="listitem"
      aria-label={acao.label}
    >
      <span className="text-lg leading-none" aria-hidden>
        {acao.emoji}
      </span>
      <span className="line-clamp-2 text-center text-[11px] font-semibold leading-tight">
        {acao.label}
      </span>
    </div>
  );
}

export default function LugarQuickActions({ modo = "estabelecimento", acoes = [] }) {
  if (!acoes.length) return null;

  const isEstabelecimento = modo === "estabelecimento";

  return (
    <section className="mt-6">
      <div
        className={
          isEstabelecimento
            ? "mx-auto flex w-full max-w-sm justify-center gap-2.5"
            : "flex gap-2.5 overflow-x-auto pb-1 scrollbar-hide snap-x snap-mandatory [-webkit-overflow-scrolling:touch]"
        }
        role="list"
        aria-label={
          isEstabelecimento
            ? "Ações rápidas do estabelecimento"
            : "Informações do local"
        }
      >
        {isEstabelecimento
          ? acoes.map((acao) => {
              const Icon = ICONS_ESTABELECIMENTO[acao.id] || IconGlobe;
              return (
                <BotaoEstabelecimento
                  key={acao.id}
                  label={acao.label}
                  href={acao.href}
                  Icon={Icon}
                />
              );
            })
          : acoes.map((acao) => <ChipPublico key={acao.id} acao={acao} />)}
      </div>
    </section>
  );
}
