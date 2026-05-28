/**
 * Proporções de tela 19,5:9 (referência iPhone 15 / flagships atuais).
 * Cantos da tela ~55pt em 393pt de largura lógica.
 */
const SCREEN_WIDTH_PT = 393;
const SCREEN_HEIGHT_PT = 852;
const SCREEN_CORNER_PT = 55;

/** Chassi + bezel (cada lado) — fino, uniforme. */
export const PHONE_FRAME_PX = 6;

/** @type {{ hero: number, showcase: number }} */
export const PHONE_OUTER_WIDTH = {
  hero: 284,
  showcase: 264,
};

/**
 * Métricas do dispositivo para mockup realista.
 * @param {number} outerWidth
 * @returns {{
 *   outerWidth: number,
 *   screenWidth: number,
 *   screenHeight: number,
 *   frameRadius: number,
 *   screenRadius: number,
 *   punch: { size: number, top: number },
 *   safeTop: number,
 *   homeIndicator: { w: number, h: number },
 * }}
 */
export function getLandingPhoneMetrics(outerWidth) {
  const screenWidth = outerWidth - PHONE_FRAME_PX;
  const screenHeight = Math.round((screenWidth * SCREEN_HEIGHT_PT) / SCREEN_WIDTH_PT);
  const s = screenWidth / SCREEN_WIDTH_PT;
  const screenRadius = Math.round(SCREEN_CORNER_PT * s);
  const frameRadius = screenRadius + 3;

  const punchSize = Math.max(7, Math.round(10 * s));
  const punchTop = Math.max(8, Math.round(12 * s));

  return {
    outerWidth,
    screenWidth,
    screenHeight,
    frameRadius,
    screenRadius,
    punch: { size: punchSize, top: punchTop },
    safeTop: punchTop + punchSize + Math.round(8 * s),
    homeIndicator: {
      w: Math.round(134 * s),
      h: Math.max(4, Math.round(5 * s)),
    },
  };
}
