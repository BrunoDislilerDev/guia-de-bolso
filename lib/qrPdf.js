import { jsPDF } from "jspdf";
import { getSiteDisplayDomain } from "./siteContact.js";
import { resolveQrPdfFormat, QR_PDF_FORMATS, QR_PDF_FORMAT_LIST } from "./qrPdf/formats.js";
import { renderPremiumQrPdf, formatCategoriaLinha } from "./qrPdf/render.js";
import { QR_PDF_THEME } from "./qrPdf/theme.js";

export { QR_PDF_FORMATS, QR_PDF_FORMAT_LIST, formatCategoriaLinha, QR_PDF_THEME };

/**
 * Cria documento jsPDF no formato escolhido.
 * @param {string} [formatId]
 * @returns {import('jspdf').jsPDF}
 */
export function createQrPdfDocument(formatId) {
  const format = resolveQrPdfFormat(formatId);
  return new jsPDF({
    unit: "mm",
    format: [format.width, format.height],
    orientation: format.width > format.height ? "landscape" : "portrait",
  });
}

/**
 * Gera PDF premium para impressão com QR Code.
 * @param {{
 *   nome: string,
 *   categoria?: string,
 *   subcategoria?: string,
 *   slug: string,
 *   qrDataUrl: string,
 *   siteUrl: string,
 *   ehParceiro?: boolean,
 *   logoDataUrl?: string|null,
 *   format?: string,
 * }} params
 * @returns {import('jspdf').jsPDF}
 */
export function buildQrPdf(params) {
  const doc = createQrPdfDocument(params.format);
  renderPremiumQrPdf(doc, params);
  return doc;
}

/**
 * Carrega logo PNG para embutir no PDF (browser).
 * @returns {Promise<string|null>}
 */
export async function loadQrPdfLogoDataUrl() {
  if (typeof window === "undefined") return null;

  try {
    const response = await fetch("/logo.png");
    if (!response.ok) return null;
    const blob = await response.blob();
    return new Promise((resolve) => {
      const reader = new FileReader();
      reader.onload = () => resolve(typeof reader.result === "string" ? reader.result : null);
      reader.onerror = () => resolve(null);
      reader.readAsDataURL(blob);
    });
  } catch {
    return null;
  }
}

/**
 * Gera data URL do QR otimizado para impressão (quiet zone + correção alta).
 * @param {string} siteUrl
 * @param {string} slug
 * @returns {Promise<string>}
 */
export async function generateQrDataUrl(siteUrl, slug) {
  const QRCode = (await import("qrcode")).default;
  const url = `${String(siteUrl).replace(/\/$/, "")}/q/${slug}`;
  return QRCode.toDataURL(url, {
    width: 900,
    margin: 2,
    errorCorrectionLevel: "H",
    color: { dark: QR_PDF_THEME.brand, light: "#ffffff" },
  });
}

/**
 * Dispara download do PDF de QR no navegador.
 * @param {Parameters<typeof buildQrPdf>[0]} params
 * @returns {Promise<void>}
 */
export async function downloadQrPdf(params) {
  const [qrDataUrl, logoDataUrl] = await Promise.all([
    params.qrDataUrl
      ? Promise.resolve(params.qrDataUrl)
      : generateQrDataUrl(params.siteUrl, params.slug),
    params.logoDataUrl !== undefined
      ? Promise.resolve(params.logoDataUrl)
      : loadQrPdfLogoDataUrl(),
  ]);

  const doc = buildQrPdf({ ...params, qrDataUrl, logoDataUrl });
  const safeName = String(params.nome || "local")
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-zA-Z0-9]+/g, "-")
    .replace(/^-|-$/g, "")
    .slice(0, 40);

  const formatSuffix = params.format && params.format !== "mesa" ? `-${params.format}` : "";
  doc.save(`qr-guia-de-bolso-${safeName || "estabelecimento"}${formatSuffix}.pdf`);
}
