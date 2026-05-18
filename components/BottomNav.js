"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

function IconHome({ className = "h-6 w-6", active = false }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill={active ? "currentColor" : "none"} stroke="currentColor" strokeWidth="2" aria-hidden>
      <path d="M3 10.5L12 3l9 7.5V21h-6v-6H9v6H3V10.5z" />
    </svg>
  );
}

function IconHeart({ className = "h-6 w-6", active = false }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill={active ? "currentColor" : "none"} stroke="currentColor" strokeWidth="2" aria-hidden>
      <path d="M20.84 4.61a5.5 5.5 0 00-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 00-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 000-7.78z" />
    </svg>
  );
}

function IconGrid({ className = "h-6 w-6", active = false }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill={active ? "currentColor" : "none"} stroke="currentColor" strokeWidth="2" aria-hidden>
      <path d="M4 4h6v6H4V4z" />
      <path d="M14 4h6v6h-6V4z" />
      <path d="M4 14h6v6H4v-6z" />
      <path d="M14 14h6v6h-6v-6z" />
    </svg>
  );
}

function IconPerson({ className = "h-6 w-6", active = false }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill={active ? "currentColor" : "none"} stroke="currentColor" strokeWidth="2" aria-hidden>
      <path d="M20 21v-2a4 4 0 00-4-4H8a4 4 0 00-4 4v2" />
      <path d="M12 11a4 4 0 100-8 4 4 0 000 8z" />
    </svg>
  );
}

const items = [
  { href: "/", label: "Início", Icon: IconHome },
  { href: "/categorias", label: "Categorias", Icon: IconGrid },
  { href: "/favoritos", label: "Favoritos", Icon: IconHeart },
  { href: "/perfil", label: "Perfil", Icon: IconPerson },
];

export default function BottomNav() {
  const pathname = usePathname();

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-40 mx-auto max-w-md border-t border-black/5 bg-white px-4 py-3 pb-[max(0.75rem,env(safe-area-inset-bottom))] shadow-[0_-8px_28px_rgba(26,74,58,0.10)]">
      <div className="flex items-center justify-around">
        {items.map(({ href, label, Icon }) => {
          const active = href === "/" ? pathname === "/" : pathname.startsWith(href);

          return (
            <Link
              key={href}
              href={href}
              className={`flex flex-col items-center gap-1 transition-colors ${
                active ? "text-[#1a4a3a]" : "text-[#9aa8a3]"
              }`}
              aria-current={active ? "page" : undefined}
            >
              <Icon active={active} />
              <span className="text-xs font-medium">{label}</span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
