import Link from "next/link";

/**
 * @param {object} props
 * @param {string} props.title
 * @param {{ href: string, label: string }[]} props.links
 * @param {string} [props.className]
 * @returns {import('react').ReactElement|null}
 */
export default function GuiaRelatedNav({ title, links, className = "" }) {
  if (!links?.length) return null;

  return (
    <nav className={className} aria-label={title}>
      <h2 className="text-lg font-bold text-[#1a2e28]">{title}</h2>
      <ul className="mt-3 grid gap-2 sm:grid-cols-2">
        {links.map((link) => (
          <li key={link.href}>
            <Link
              href={link.href}
              className="block rounded-xl bg-[#f0f4f3] px-4 py-3 text-sm font-semibold text-[#1a4a3a] hover:bg-[#e8f4f0]"
            >
              {link.label}
            </Link>
          </li>
        ))}
      </ul>
    </nav>
  );
}
