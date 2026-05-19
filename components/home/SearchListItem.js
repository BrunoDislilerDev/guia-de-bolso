"use client";

import Link from "next/link";

function PlaceThumb({ imagemUrl, nome }) {
  if (imagemUrl) {
    return (
      // eslint-disable-next-line @next/next/no-img-element
      <img
        src={imagemUrl}
        alt=""
        className="h-10 w-10 shrink-0 rounded-full object-cover"
      />
    );
  }

  return (
    <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-[#d4ede8] text-sm font-bold text-[#1a4a3a]">
      {(nome || "?").charAt(0).toUpperCase()}
    </div>
  );
}

export default function SearchListItem({ href, imagemUrl, nome, categoria, leading }) {
  return (
    <Link
      href={href}
      className="flex items-center gap-3 rounded-xl bg-white px-3 py-2.5 shadow-sm transition-colors hover:bg-[#f7faf9] active:bg-[#eef3f1]"
    >
      <span className="flex h-8 w-8 shrink-0 items-center justify-center text-base">
        {leading}
      </span>
      <PlaceThumb imagemUrl={imagemUrl} nome={nome} />
      <div className="min-w-0 flex-1">
        <p className="truncate text-sm font-semibold text-[#1a2e28]">{nome}</p>
        <p className="truncate text-xs text-[#5a6b66]">{categoria}</p>
      </div>
    </Link>
  );
}
