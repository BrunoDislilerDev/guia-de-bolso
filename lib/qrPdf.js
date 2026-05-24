import { jsPDF } from "jspdf";

const BRAND = "#1a4a3a";
const MUTED = "#5a6b66";
const GOLD = "#b8860b";

/**
 * Converte hex para RGB para jsPDF.
 * @param {string} hex
 * @returns {[number, number, number]}
 */
function hexToRgb(hex) {
  const h = hex.replace("#", "");
  return [
    parseInt(h.slice(0, 2), 16),
    parseInt(h.slice(2, 4), 16),
    parseInt(h.slice(4, 6), 16),
  ];
}

/**
 * Gera PDF A6 para impressão em mesa/balcão com QR Code.
 * @param {{
 *   nome: string,
 *   categoria?: string,
 *   slug: string,
 *   qrDataUrl: string,
 *   siteUrl: string,
 *   ehParceiro?: boolean,
 * }} params
 * @returns {jsPDF}
 */
export function buildQrPdf({
  nome,
  categoria,
  slug,
  qrDataUrl,
  siteUrl,
  ehParceiro = false,
}) {
  const doc = new jsPDF({ unit: "mm", format: "a6" });
  const pageW = doc.internal.pageSize.getWidth();
  const pageH = doc.internal.pageSize.getHeight();
  const margin = 10;
  const brandRgb = hexToRgb(BRAND);
  const mutedRgb = hexToRgb(MUTED);
  const goldRgb = hexToRgb(GOLD);

  doc.setFillColor(...brandRgb);
  doc.rect(0, 0, pageW, 22, "F");

  doc.setTextColor(255, 255, 255);
  doc.setFontSize(11);
  doc.setFont("helvetica", "bold");
  doc.text("Guia de Bolso", pageW / 2, 10, { align: "center" });

  doc.setFontSize(7);
  doc.setFont("helvetica", "normal");
  doc.text("Imbituba · SC", pageW / 2, 16, { align: "center" });

  let y = 30;

  if (ehParceiro) {
    doc.setFillColor(...goldRgb);
    doc.roundedRect(margin, y - 5, pageW - margin * 2, 8, 2, 2, "F");
    doc.setTextColor(255, 255, 255);
    doc.setFontSize(7);
    doc.setFont("helvetica", "bold");
    doc.text("Parceiro do guia", pageW / 2, y, { align: "center" });
    y += 10;
  }

  doc.setTextColor(...brandRgb);
  doc.setFontSize(13);
  doc.setFont("helvetica", "bold");
  const nomeLines = doc.splitTextToSize(nome, pageW - margin * 2);
  doc.text(nomeLines, pageW / 2, y, { align: "center" });
  y += nomeLines.length * 6 + 2;

  if (categoria) {
    doc.setFontSize(8);
    doc.setFont("helvetica", "normal");
    doc.setTextColor(...mutedRgb);
    doc.text(categoria, pageW / 2, y, { align: "center" });
    y += 8;
  }

  const qrSize = 52;
  const qrX = (pageW - qrSize) / 2;
  doc.addImage(qrDataUrl, "PNG", qrX, y, qrSize, qrSize);
  y += qrSize + 8;

  doc.setFontSize(8);
  doc.setFont("helvetica", "bold");
  doc.setTextColor(...brandRgb);
  doc.text("Escaneie e veja no Guia de Bolso", pageW / 2, y, { align: "center" });
  y += 6;

  const shortUrl = `${siteUrl.replace(/\/$/, "")}/q/${slug}`;
  doc.setFontSize(7);
  doc.setFont("helvetica", "normal");
  doc.setTextColor(...mutedRgb);
  const urlLines = doc.splitTextToSize(shortUrl, pageW - margin * 2);
  doc.text(urlLines, pageW / 2, y, { align: "center" });

  doc.setFontSize(6);
  doc.text("guia-de-bolso-puce.vercel.app", pageW / 2, pageH - 6, { align: "center" });

  return doc;
}

/**
 * Dispara download do PDF de QR no navegador.
 * @param {Parameters<typeof buildQrPdf>[0]} params
 * @returns {Promise<void>}
 */
export async function downloadQrPdf(params) {
  const QRCode = (await import("qrcode")).default;
  const qrDataUrl = await QRCode.toDataURL(params.siteUrl.replace(/\/$/, "") + `/q/${params.slug}`, {
    width: 512,
    margin: 1,
    color: { dark: BRAND, light: "#ffffff" },
  });

  const doc = buildQrPdf({ ...params, qrDataUrl });
  const safeName = String(params.nome || "local")
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-zA-Z0-9]+/g, "-")
    .replace(/^-|-$/g, "")
    .slice(0, 40);

  doc.save(`qr-guia-de-bolso-${safeName || "estabelecimento"}.pdf`);
}
