import Link from "next/link";

/**
 * @typedef {import('@/lib/guiaPageData').GuiaPlaceCard} GuiaPlaceCard
 */

/**
 * Lista de lugares linkados para SEO interno.
 * @param {object} props
 * @param {string} props.title
 * @param {GuiaPlaceCard[]} props.places
 * @returns {import('react').ReactElement|null}
 */
export default function GuiaPlacesList({ title, places }) {
  if (!places?.length) return null;

  return (
    <section className="mt-10" aria-labelledby="guia-places-heading">
      <h2 id="guia-places-heading" className="text-xl font-bold text-[#1a2e28]">
        {title}
      </h2>
      <ul className="mt-4 space-y-2">
        {places.map((place) => (
          <li key={place.id}>
            <Link
              href={place.href}
              className="block rounded-xl bg-white px-4 py-3 ring-1 ring-[#e8eeee] hover:ring-[#1a4a3a]/20"
            >
              <span className="font-semibold text-[#1a4a3a]">{place.nome}</span>
              {place.descricao && (
                <p className="mt-0.5 line-clamp-2 text-sm text-[#5a6b66]">{place.descricao}</p>
              )}
            </Link>
          </li>
        ))}
      </ul>
    </section>
  );
}
