"use client";

import { usePathname } from "next/navigation";
import {
  getMarketingHomePath,
  resolveLandingNavHref,
  resolveMarketingHomeHref,
  LANDING_NAV_ITEMS,
} from "@/lib/landingNav";
import { LANDING_SECTION_IDS } from "@/lib/landingContent";

/**
 * Navegação da landing com hrefs corretos em subpáginas (ex.: /para-negocios).
 * @returns {{ homePath: string, navItems: { label: string, href: string }[], sectionHref: (id: string) => string }}
 */
export function useLandingNav() {
  const pathname = usePathname() ?? "";
  const homePath = getMarketingHomePath();

  const navItems = LANDING_NAV_ITEMS.map((item) => ({
    label: item.label,
    href: resolveLandingNavHref(pathname, item),
  }));

  /** @param {string} sectionId */
  function sectionHref(sectionId) {
    return resolveMarketingHomeHref(pathname, sectionId);
  }

  return {
    homePath,
    navItems,
    sectionHref,
    exploreHref: sectionHref(LANDING_SECTION_IDS.categorias),
    negociosHref: sectionHref(LANDING_SECTION_IDS.negocios),
  };
}
