/** Proporção da tela lógica do iPhone 15 Pro (393×852 pt). */
const SCREEN_WIDTH_PT = 393;
const SCREEN_HEIGHT_PT = 852;

/** Bezel total (titanium + preto) em px — fixo, não escala com o tamanho. */
export const PHONE_BEZEL_PX = 10;

/** @type {{ hero: number, showcase: number }} */
export const PHONE_OUTER_WIDTH = {
  hero: 300,
  showcase: 276,
};

/**
 * Métricas do mockup proporcionais ao iPhone 15 Pro.
 * @param {number} outerWidth — largura total do chassi em px
 * @returns {{
 *   outerWidth: number,
 *   screenWidth: number,
 *   screenHeight: number,
 *   deviceRadius: number,
 *   screenRadius: number,
 *   island: { w: number, h: number, top: number },
 *   safeTop: number,
 *   homeIndicator: { w: number, h: number },
 * }}
 */
export function getLandingPhoneMetrics(outerWidth) {
  const screenWidth = outerWidth - PHONE_BEZEL_PX;
  const screenHeight = Math.round((screenWidth * SCREEN_HEIGHT_PT) / SCREEN_WIDTH_PT);
  const s = screenWidth / SCREEN_WIDTH_PT;

  return {
    outerWidth,
    screenWidth,
    screenHeight,
    deviceRadius: Math.round(47 * s) + 2,
    screenRadius: Math.round(55 * s),
    island: {
      w: Math.round(126 * s),
      h: Math.max(11, Math.round(37.9 * s * 0.46)),
      top: Math.max(6, Math.round(11 * s)),
    },
    safeTop: Math.round(54 * s),
    homeIndicator: {
      w: Math.round(134 * s),
      h: Math.max(4, Math.round(5 * s)),
    },
  };
}
