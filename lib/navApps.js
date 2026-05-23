import { NAV_APPS } from "@/lib/perfil";

/** Subtítulo por app na sheet de navegação. */
export const NAV_APP_SUBTITLES = {
  google: "Abrir no Google Maps",
  apple: "Abrir no Apple Maps",
  waze: "Abrir no Waze",
};

/**
 * @param {string} key
 * @returns {string}
 */
export function getNavAppSubtitle(key) {
  return NAV_APP_SUBTITLES[key] ?? "Abrir no app de mapas";
}

export { NAV_APPS };
