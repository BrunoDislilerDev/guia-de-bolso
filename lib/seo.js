import { getCategoriaByNome, getCategoriaHref } from "@/lib/categorias";
import { getCapaFromLugar, getFotosFromRota } from "@/lib/fotos";
import { getLugarPublicPath } from "@/lib/lugarPublicPath";
import { getRotaNome } from "@/lib/rotaDetalheDisplay";
import { getSiteUrl } from "@/lib/siteUrl";

import { truncateMetaDescription } from "./seoText.js";

export const SITE_NAME = "Guia de Bolso";
const DEFAULT_DESCRIPTION =
  "Guia oficial de Imbituba, SC — praias, trilhas, gastronomia, rotas e busca com IA.";

export { truncateMetaDescription };

/**
 * @returns {URL}
 */
export function getMetadataBase() {
  return new URL(`${getSiteUrl()}/`);
}

/**
 * @param {object} options
 * @param {string} options.title - Sem sufixo do site (exceto se já incluir).
 * @param {string} [options.description]
 * @param {string} [options.path] - Caminho absoluto começando com /.
 * @param {string} [options.image] - URL absoluta ou relativa da imagem OG.
 * @param {boolean} [options.noIndex]
 * @returns {import('next').Metadata}
 */
export function buildPageMetadata({ title, description, path = "/", image, noIndex = false }) {
  const base = getMetadataBase();
  const canonicalPath = path.startsWith("/") ? path : `/${path}`;
  const url = new URL(canonicalPath.slice(1), base).toString();
  const desc = truncateMetaDescription(description);
  const fullTitle =
    title === SITE_NAME
      ? SITE_NAME
      : title.includes(SITE_NAME)
        ? title
        : `${title} | ${SITE_NAME}`;

  const imageUrl = image
    ? image.startsWith("http")
      ? image
      : new URL(image.replace(/^\//, ""), base).toString()
    : new URL("logo.png", base).toString();

  const robots = noIndex ? { index: false, follow: false } : { index: true, follow: true };

  return {
    title: fullTitle,
    description: desc,
    alternates: { canonical: url },
    robots,
    openGraph: {
      type: "website",
      locale: "pt_BR",
      url,
      siteName: SITE_NAME,
      title: fullTitle,
      description: desc,
      images: [{ url: imageUrl, alt: title }],
    },
    twitter: {
      card: "summary_large_image",
      title: fullTitle,
      description: desc,
      images: [imageUrl],
    },
  };
}

/**
 * @param {object} lugar
 * @returns {import('next').Metadata}
 */
export function buildLugarMetadata(lugar) {
  const nome = lugar?.nome || "Lugar";
  const categoria = lugar?.categoria ? ` · ${lugar.categoria}` : "";
  const title = `${nome}${categoria} · Imbituba`;
  const description =
    lugar?.descricao ||
    lugar?.descricao_longa ||
    `Confira ${nome} no Guia de Bolso — Imbituba, Santa Catarina.`;
  const image = getCapaFromLugar(lugar) || undefined;

  return buildPageMetadata({
    title,
    description,
    path: getLugarPublicPath(lugar),
    image,
  });
}

/**
 * @param {string} categoriaNome
 * @returns {import('next').Metadata}
 */
export function buildCategoriaMetadata(categoriaNome) {
  const meta = getCategoriaByNome(categoriaNome);
  const title = `${categoriaNome} em Imbituba`;
  const description =
    meta?.descricao ||
    `Descubra locais de ${categoriaNome} em Imbituba, SC — Guia de Bolso.`;

  return buildPageMetadata({
    title,
    description,
    path: getCategoriaHref(categoriaNome),
  });
}

/**
 * @param {object} rota
 * @returns {import('next').Metadata}
 */
export function buildRotaMetadata(rota) {
  const nome = getRotaNome(rota);
  const categoria = rota?.categoria ? ` · ${rota.categoria}` : "";
  const title = `${nome}${categoria} · Rota em Imbituba`;
  const fotos = getFotosFromRota(rota);

  return buildPageMetadata({
    title,
    description: rota?.descricao || `Rota curada ${nome} no Guia de Bolso.`,
    path: `/rotas/${rota.id}`,
    image: fotos[0],
  });
}

/** Metadata padrão do site (layout). */
export const DEFAULT_SITE_METADATA = buildPageMetadata({
  title: SITE_NAME,
  description: DEFAULT_DESCRIPTION,
  path: "/",
});

/**
 * Metadata da home (título e descrição dedicados).
 * @returns {import('next').Metadata}
 */
export function buildHomeMetadata() {
  return buildPageMetadata({
    title: "O que fazer em Imbituba, SC",
    description:
      "Praias, gastronomia, trilhas e rotas em Imbituba. Busca com IA, mapas e curadoria local no Guia de Bolso.",
    path: "/",
  });
}

/**
 * Metadata da página Explorar / categorias.
 * @returns {import('next').Metadata}
 */
export function buildExplorarMetadata() {
  return buildPageMetadata({
    title: "Explorar Imbituba — categorias e lugares",
    description:
      "Navegue por Natureza, Gastronomia, Noite e mais. Encontre lugares em Imbituba por categoria.",
    path: "/categorias",
  });
}

/**
 * Metadata da landing Imbituba.
 * @returns {import('next').Metadata}
 */
export function buildImbitubaMetadata() {
  return buildPageMetadata({
    title: "Guia turístico de Imbituba, Santa Catarina",
    description:
      "Praias como Praia do Rosa e Praia da Vila, gastronomia, natureza e roteiros. Tudo no Guia de Bolso.",
    path: "/imbituba",
  });
}

/**
 * Metadata da landing marketing (/landing).
 * @returns {import('next').Metadata}
 */
export function buildLandingMetadata() {
  return buildPageMetadata({
    title: "Guia local de Garopaba e Imbituba — negócios e turismo",
    description:
      "Cadastre seu estabelecimento ou explore praias, restaurantes e serviços na região. Guia de Bolso — descoberta local com curadoria catarinense.",
    path: "/",
    image: "/landing-og.svg",
  });
}
