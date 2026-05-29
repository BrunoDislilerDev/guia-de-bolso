/** Paleta premium — CMYK-friendly, contraste alto para impressão. */
export const QR_PDF_THEME = {
  brand: "#1a4a3a",
  brandLight: "#2d6b54",
  ink: "#1a2e28",
  muted: "#5a6b66",
  mutedLight: "#8a9a94",
  paper: "#f6f8f7",
  card: "#ffffff",
  border: "#e2eae6",
  borderSoft: "#eef2f0",
  gold: "#9a7b2f",
  goldBg: "#f5f0e4",
  accent: "#7a4a42",
  white: "#ffffff",
};

/**
 * @param {string} hex
 * @returns {[number, number, number]}
 */
export function hexToRgb(hex) {
  const h = hex.replace("#", "");
  return [
    parseInt(h.slice(0, 2), 16),
    parseInt(h.slice(2, 4), 16),
    parseInt(h.slice(4, 6), 16),
  ];
}
