/**
 * Formatos de impressão do cartaz QR (mm).
 * @typedef {{ id: string, label: string, width: number, height: number, cardWidth?: number, compact?: boolean }} QrPdfFormat
 */

/** @type {Record<string, QrPdfFormat>} */
export const QR_PDF_FORMATS = {
  mesa: {
    id: "mesa",
    label: "Mesa / balcão (A6)",
    width: 105,
    height: 148,
  },
  adesivo: {
    id: "adesivo",
    label: "Adesivo pequeno (8×8 cm)",
    width: 80,
    height: 80,
    compact: true,
  },
  display: {
    id: "display",
    label: "Display acrílico (A5)",
    width: 148,
    height: 210,
  },
  a5: {
    id: "a5",
    label: "Impressão A5",
    width: 148,
    height: 210,
  },
  a4: {
    id: "a4",
    label: "Impressão A4 (cartão central)",
    width: 210,
    height: 297,
    cardWidth: 140,
  },
  quadrado: {
    id: "quadrado",
    label: "Quadrado (Instagram / 12×12 cm)",
    width: 120,
    height: 120,
  },
};

/** @type {QrPdfFormat[]} */
export const QR_PDF_FORMAT_LIST = Object.values(QR_PDF_FORMATS);

/**
 * @param {string} [formatId]
 * @returns {QrPdfFormat}
 */
export function resolveQrPdfFormat(formatId) {
  return QR_PDF_FORMATS[formatId] || QR_PDF_FORMATS.mesa;
}
