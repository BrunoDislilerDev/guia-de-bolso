import { getCategoriaHref } from "./categorias.js";
import { getCapaFromLugar, getFotosFromRota } from "./fotos.js";
import { isLugarPublico } from "./lugarDetalhe.js";
import { getLugarPublicPath, getLugarPublicUrl } from "./lugarPublicPath.js";
import { getRotaNome } from "./rotaDetalheDisplay.js";
import { truncateMetaDescription } from "./seoText.js";
import { getSiteUrl } from "./siteUrl.js";

const SITE_LABEL = "Guia de Bolso";

const PUBLISHER = {
  "@type": "Organization",
  name: SITE_LABEL,
  url: getSiteUrl(),
};

/**
 * @param {object|null|undefined} localizacao
 * @returns {object|null}
 */
function buildPostalAddress(localizacao) {
  const endereco = localizacao?.endereco_completo?.trim();
  if (!endereco) return null;

  return {
    "@type": "PostalAddress",
    streetAddress: endereco,
    addressLocality: "Imbituba",
    addressRegion: "SC",
    addressCountry: "BR",
  };
}

/**
 * @param {object|null|undefined} localizacao
 * @returns {object|null}
 */
function buildGeo(localizacao) {
  const lat = Number(localizacao?.latitude);
  const lng = Number(localizacao?.longitude);
  if (!Number.isFinite(lat) || !Number.isFinite(lng)) return null;

  return {
    "@type": "GeoCoordinates",
    latitude: lat,
    longitude: lng,
  };
}

/**
 * @param {{ media?: number, count?: number }} [rating]
 * @returns {object|null}
 */
function buildAggregateRating(rating) {
  const count = Number(rating?.count) || 0;
  const media = Number(rating?.media);
  if (count <= 0 || !Number.isFinite(media) || media <= 0) return null;

  return {
    "@type": "AggregateRating",
    ratingValue: Math.round(media * 10) / 10,
    reviewCount: count,
    bestRating: 5,
    worstRating: 1,
  };
}

/**
 * @param {object} lugar
 * @returns {string}
 */
export function getLugarSchemaType(lugar) {
  if (lugar?.categoria === "Gastronomia") return "FoodEstablishment";
  if (isLugarPublico(lugar)) return "TouristAttraction";
  return "LocalBusiness";
}

/**
 * JSON-LD para detalhe do lugar.
 * @param {object} lugar
 * @param {object|null} [localizacao]
 * @param {{ media?: number, count?: number }} [rating]
 * @returns {object}
 */
export function buildLugarJsonLd(lugar, localizacao = null, rating) {
  const type = getLugarSchemaType(lugar);
  const url = getLugarPublicUrl(lugar);
  const image = getCapaFromLugar(lugar);
  const description = truncateMetaDescription(
    lugar?.descricao || lugar?.descricao_longa || `Local em Imbituba: ${lugar?.nome}`
  );

  /** @type {Record<string, unknown>} */
  const node = {
    "@context": "https://schema.org",
    "@type": type,
    "@id": `${url}#place`,
    name: lugar?.nome,
    description,
    url,
    image: image || undefined,
    address: buildPostalAddress(localizacao) || undefined,
    geo: buildGeo(localizacao) || undefined,
    aggregateRating: buildAggregateRating(rating) || undefined,
    isAccessibleForFree: true,
  };

  if (lugar?.telefone) {
    node.telephone = lugar.telefone;
  }

  return node;
}

/**
 * BreadcrumbList para detalhe do lugar.
 * @param {object} lugar
 * @returns {object}
 */
export function buildLugarBreadcrumbJsonLd(lugar) {
  const base = getSiteUrl();
  const items = [
    { name: "Início", path: "/" },
  ];

  if (lugar?.categoria) {
    items.push({ name: lugar.categoria, path: getCategoriaHref(lugar.categoria) });
  }

  items.push({ name: lugar?.nome || "Lugar", path: getLugarPublicPath(lugar) });

  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: items.map((item, index) => ({
      "@type": "ListItem",
      position: index + 1,
      name: item.name,
      item: `${base}${item.path.startsWith("/") ? item.path : `/${item.path}`}`,
    })),
  };
}

/**
 * @param {object} rota
 * @returns {object}
 */
export function buildRotaJsonLd(rota) {
  const nome = getRotaNome(rota);
  const url = `${getSiteUrl()}/rotas/${rota.id}`;
  const image = getFotosFromRota(rota)[0];

  return {
    "@context": "https://schema.org",
    "@type": "TouristTrip",
    name: nome,
    description: truncateMetaDescription(rota?.descricao || `Rota curada em Imbituba: ${nome}`),
    url,
    image: image || undefined,
    touristType: "https://schema.org/Tourist",
    provider: PUBLISHER,
  };
}

/**
 * @param {string} categoriaNome
 * @param {string} [descricao]
 * @returns {object}
 */
export function buildCategoriaJsonLd(categoriaNome, descricao) {
  const url = `${getSiteUrl()}${getCategoriaHref(categoriaNome)}`;

  return {
    "@context": "https://schema.org",
    "@type": "CollectionPage",
    name: `${categoriaNome} em Imbituba`,
    description: truncateMetaDescription(
      descricao || `Locais de ${categoriaNome} em Imbituba, Santa Catarina.`
    ),
    url,
    isPartOf: {
      "@type": "WebSite",
      name: "Guia de Bolso",
      url: getSiteUrl(),
    },
  };
}

/**
 * WebSite + Organization para a home.
 * @returns {object}
 */
export function buildHomeJsonLd() {
  const url = getSiteUrl();

  return toJsonLdGraph([
    {
      "@context": "https://schema.org",
      "@type": "WebSite",
      name: SITE_LABEL,
      url,
      description: truncateMetaDescription(
        "Guia oficial de Imbituba — praias, trilhas, gastronomia e rotas."
      ),
      inLanguage: "pt-BR",
      publisher: PUBLISHER,
    },
    {
      "@context": "https://schema.org",
      "@type": "TouristInformationCenter",
      name: SITE_LABEL,
      url,
      description: "Guia de descoberta local para Imbituba, Santa Catarina, Brasil",
      areaServed: {
        "@type": "City",
        name: "Imbituba",
        containedInPlace: {
          "@type": "State",
          name: "Santa Catarina",
        },
      },
    },
  ]);
}

/**
 * @param {object[]} graphs
 * @returns {object}
 */
export function toJsonLdGraph(graphs) {
  const filtered = graphs.filter(Boolean);
  if (filtered.length === 1) return filtered[0];
  return {
    "@context": "https://schema.org",
    "@graph": filtered.map((g) => {
      const { "@context": _ctx, ...rest } = g;
      return rest;
    }),
  };
}
