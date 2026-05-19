"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

/**
 * IconHome - Home tab navigation icon.
 * @param {object} props
 * @param {string} [props.className]
 * @param {boolean} [props.active]
 * @returns {import('react').ReactElement}
 */
function IconHome({ className = "h-5 w-5", active = false }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill={active ? "currentColor" : "none"} stroke="currentColor" strokeWidth="2" aria-hidden>
      <path d="M3 10.5L12 3l9 7.5V21h-6v-6H9v6H3V10.5z" />
    </svg>
  );
}

/**
 * IconHeart - Favorites tab navigation icon.
 * @param {object} props
 * @param {string} [props.className]
 * @param {boolean} [props.active]
 * @returns {import('react').ReactElement}
 */
function IconHeart({ className = "h-5 w-5", active = false }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill={active ? "currentColor" : "none"} stroke="currentColor" strokeWidth="2" aria-hidden>
      <path d="M20.84 4.61a5.5 5.5 0 00-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 00-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 000-7.78z" />
    </svg>
  );
}

/**
 * IconGrid - Explore/categories tab navigation icon.
 * @param {object} props
 * @param {string} [props.className]
 * @param {boolean} [props.active]
 * @returns {import('react').ReactElement}
 */
function IconGrid({ className = "h-5 w-5", active = false }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill={active ? "currentColor" : "none"} stroke="currentColor" strokeWidth="2" aria-hidden>
      <path d="M4 4h6v6H4V4zM14 4h6v6h-6V4zM4 14h6v6H4v-6zM14 14h6v6h-6v-6z" />
    </svg>
  );
}

/**
 * IconMap - Routes tab navigation icon.
 * @param {object} props
 * @param {string} [props.className]
 * @param {boolean} [props.active]
 * @returns {import('react').ReactElement}
 */
function IconMap({ className = "h-5 w-5", active = false }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill={active ? "currentColor" : "none"} stroke="currentColor" strokeWidth="2" aria-hidden>
      <path d="M9 18l-6 3V6l6-3 6 3 6-3v15l-6 3-6-3z" />
      <path d="M9 3v15M15 6v15" />
    </svg>
  );
}

/**
 * IconPerson - Profile tab navigation icon.
 * @param {object} props
 * @param {string} [props.className]
 * @param {boolean} [props.active]
 * @returns {import('react').ReactElement}
 */
function IconPerson({ className = "h-5 w-5", active = false }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill={active ? "currentColor" : "none"} stroke="currentColor" strokeWidth="2" aria-hidden>
      <path d="M20 21v-2a4 4 0 00-4-4H8a4 4 0 00-4 4v2" />
      <path d="M12 11a4 4 0 100-8 4 4 0 000 8z" />
    </svg>
  );
}

const items = [
  { href: "/", label: "Início", Icon: IconHome },
  { href: "/categorias", label: "Explorar", Icon: IconGrid },
  { href: "/rotas", label: "Rotas", Icon: IconMap },
  { href: "/favoritos", label: "Favoritos", Icon: IconHeart },
  { href: "/perfil", label: "Perfil", Icon: IconPerson },
];

/**
 * BottomNav - Fixed bottom navigation bar with primary app routes.
 * @returns {import('react').ReactElement}
 */
export default function BottomNav() {
  const pathname = usePathname();

  return (
    <nav
      className="pointer-events-none fixed inset-x-0 bottom-0 z-40 flex justify-center px-4 pb-[max(0.75rem,env(safe-area-inset-bottom))]"
      aria-label="Navegação principal"
    >
      <div className="pointer-events-auto flex w-full max-w-md items-center justify-around gap-0.5 rounded-[28px] border border-white/20 bg-white/85 px-2 py-2 shadow-[0_8px_32px_rgba(11,26,26,0.12)] backdrop-blur-xl">
        {items.map(({ href, label, Icon }) => {
          const active = href === "/" ? pathname === "/" : pathname.startsWith(href);

          return (
            <Link
              key={href}
              href={href}
              aria-label={label}
              className={`flex min-w-0 flex-1 flex-col items-center gap-0.5 rounded-2xl px-1.5 py-2 transition-all ${
                active
                  ? "bg-[#1a4a3a] text-white shadow-sm"
                  : "text-[#5a6b66] hover:text-[#1a4a3a]"
              }`}
              aria-current={active ? "page" : undefined}
            >
              <Icon active={active} />
              <span className="text-[10px] font-semibold leading-tight">{label}</span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
