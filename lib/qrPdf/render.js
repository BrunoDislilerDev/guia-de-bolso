import { getSiteDisplayDomain } from "../siteContact.js";
import { QR_PDF_THEME, hexToRgb } from "./theme.js";
import { resolveQrPdfFormat } from "./formats.js";

const BENEFITS = [
  { label: "Cardápio" },
  { label: "Fotos" },
  { label: "Avaliações" },
  { label: "Mapa" },
];

/**
 * @param {string} [categoria]
 * @param {string} [subcategoria]
 * @returns {string}
 */
export function formatCategoriaLinha(categoria, subcategoria) {
  const cat = String(categoria || "").trim();
  const sub = String(subcategoria || "").trim();
  if (cat && sub) return `${cat} · ${sub}`;
  return cat || sub || "";
}

/**
 * @param {import('jspdf').jsPDF} doc
 * @param {number} x
 * @param {number} y
 * @param {number} w
 * @param {string} label
 * @param {[number, number, number]} inkRgb
 * @param {number} fontSize
 */
function drawBenefitChip(doc, x, y, w, label, inkRgb, fontSize) {
  const h = fontSize + 3.2;
  doc.setFillColor(246, 248, 247);
  doc.setDrawColor(226, 234, 230);
  doc.setLineWidth(0.15);
  doc.roundedRect(x, y, w, h, 1.2, 1.2, "FD");
  doc.setFontSize(fontSize);
  doc.setFont("helvetica", "normal");
  doc.setTextColor(...inkRgb);
  doc.text(label, x + w / 2, y + h * 0.68, { align: "center" });
  return h;
}

/**
 * Detalhe minimalista (inspirado em linha japonesa).
 * @param {import('jspdf').jsPDF} doc
 * @param {number} cx
 * @param {number} y
 * @param {number} w
 * @param {[number, number, number]} accentRgb
 */
function drawAccentDivider(doc, cx, y, w, accentRgb) {
  const lineW = Math.min(w * 0.35, 28);
  const x0 = cx - lineW / 2;
  doc.setDrawColor(...accentRgb);
  doc.setLineWidth(0.35);
  doc.line(x0, y, x0 + lineW, y);
  doc.setFillColor(...accentRgb);
  doc.circle(cx, y, 0.55, "F");
}

/**
 * @param {import('jspdf').jsPDF} doc
 * @param {{
 *   pageW: number,
 *   pageH: number,
 *   cardX: number,
 *   cardY: number,
 *   cardW: number,
 *   cardH: number,
 *   nome: string,
 *   categoriaLinha: string,
 *   qrDataUrl: string,
 *   shortUrl: string,
 *   siteDomain: string,
 *   ehParceiro: boolean,
 *   logoDataUrl?: string|null,
 *   compact?: boolean,
 * }} opts
 */
function renderPremiumCard(doc, opts) {
  const {
    pageW,
    cardX,
    cardY,
    cardW,
    cardH,
    nome,
    categoriaLinha,
    qrDataUrl,
    shortUrl,
    siteDomain,
    ehParceiro,
    logoDataUrl,
    compact = false,
  } = opts;

  const brandRgb = hexToRgb(QR_PDF_THEME.brand);
  const inkRgb = hexToRgb(QR_PDF_THEME.ink);
  const mutedRgb = hexToRgb(QR_PDF_THEME.muted);
  const goldRgb = hexToRgb(QR_PDF_THEME.gold);
  const accentRgb = hexToRgb(QR_PDF_THEME.accent);
  const cx = pageW / 2;

  const pad = compact ? 5 : 8;
  const innerX = cardX + pad;
  const innerW = cardW - pad * 2;
  let y = cardY + (compact ? 5 : 7);

  doc.setFillColor(255, 255, 255);
  doc.setDrawColor(226, 234, 230);
  doc.setLineWidth(0.2);
  doc.roundedRect(cardX, cardY, cardW, cardH, compact ? 2 : 3, compact ? 2 : 3, "FD");

  doc.setFillColor(240, 244, 242);
  doc.roundedRect(cardX + 0.6, cardY + 0.6, cardW - 1.2, compact ? 10 : 14, 2.5, 2.5, "F");

  if (logoDataUrl) {
    const logoH = compact ? 5 : 7;
    const logoW = logoH * 1.1;
    doc.addImage(logoDataUrl, "PNG", cx - logoW / 2, y, logoW, logoH);
    y += logoH + 1.5;
  } else {
    doc.setFontSize(compact ? 6 : 7);
    doc.setFont("helvetica", "bold");
    doc.setTextColor(...brandRgb);
    doc.text("Guia de Bolso", cx, y + 2, { align: "center" });
    y += compact ? 5 : 6;
  }

  if (!compact) {
    doc.setFontSize(5);
    doc.setFont("helvetica", "normal");
    doc.setTextColor(...mutedRgb);
    doc.text("Imbituba · Santa Catarina", cx, y, { align: "center" });
    y += 4;
  }

  drawAccentDivider(doc, cx, y, innerW, accentRgb);
  y += compact ? 4 : 6;

  if (ehParceiro) {
    const badgeW = compact ? 32 : 42;
    const badgeH = compact ? 4.5 : 5.5;
    doc.setFillColor(245, 240, 228);
    doc.setDrawColor(...goldRgb);
    doc.setLineWidth(0.2);
    doc.roundedRect(cx - badgeW / 2, y, badgeW, badgeH, 1.5, 1.5, "FD");
    doc.setFontSize(compact ? 4.5 : 5);
    doc.setFont("helvetica", "bold");
    doc.setTextColor(...goldRgb);
    doc.text("Parceiro oficial", cx, y + badgeH * 0.72, { align: "center" });
    y += badgeH + 3;
  }

  const nomeSize = compact ? 9 : 13;
  doc.setFontSize(nomeSize);
  doc.setFont("helvetica", "bold");
  doc.setTextColor(...inkRgb);
  const nomeLines = doc.splitTextToSize(nome, innerW);
  doc.text(nomeLines, cx, y, { align: "center" });
  y += nomeLines.length * (compact ? 4 : 5.5) + 1;

  if (categoriaLinha) {
    doc.setFontSize(compact ? 5.5 : 7.5);
    doc.setFont("helvetica", "normal");
    doc.setTextColor(...mutedRgb);
    const catLines = doc.splitTextToSize(categoriaLinha, innerW);
    doc.text(catLines, cx, y, { align: "center" });
    y += catLines.length * (compact ? 3.5 : 4) + 2;
  }

  const qrMargin = compact ? 3 : 5;
  const qrSize = Math.min(
    innerW - qrMargin * 2,
    compact ? innerW * 0.52 : Math.min(innerW * 0.58, 58)
  );
  const qrFramePad = compact ? 2.5 : 4;
  const frameSize = qrSize + qrFramePad * 2;
  const frameX = cx - frameSize / 2;
  const frameY = y;

  doc.setFillColor(255, 255, 255);
  doc.setDrawColor(...brandRgb);
  doc.setLineWidth(compact ? 0.35 : 0.45);
  doc.roundedRect(frameX, frameY, frameSize, frameSize, 2, 2, "FD");

  doc.addImage(
    qrDataUrl,
    "PNG",
    frameX + qrFramePad,
    frameY + qrFramePad,
    qrSize,
    qrSize
  );
  y += frameSize + (compact ? 4 : 6);

  const cta = compact ? "Escaneie e explore" : "Veja cardápio, fotos e avaliações";
  doc.setFontSize(compact ? 6.5 : 8.5);
  doc.setFont("helvetica", "bold");
  doc.setTextColor(...brandRgb);
  doc.text(cta, cx, y, { align: "center" });
  y += compact ? 4 : 5;

  if (!compact) {
    doc.setFontSize(6);
    doc.setFont("helvetica", "normal");
    doc.setTextColor(...mutedRgb);
    doc.text("Descubra no Guia de Bolso", cx, y, { align: "center" });
    y += 5;

    const chipFont = 5;
    const gap = 2;
    const chipW = (innerW - gap * 3) / 4;
    let chipY = y;
    for (let i = 0; i < BENEFITS.length; i += 1) {
      drawBenefitChip(
        doc,
        innerX + i * (chipW + gap),
        chipY,
        chipW,
        BENEFITS[i].label,
        inkRgb,
        chipFont
      );
    }
    y += chipFont + 5;

    const sealW = 52;
    const sealH = 5;
    doc.setFillColor(26, 74, 58);
    doc.roundedRect(cx - sealW / 2, y, sealW, sealH, 1.2, 1.2, "F");
    doc.setFontSize(4.5);
    doc.setFont("helvetica", "bold");
    doc.setTextColor(255, 255, 255);
    doc.text("Disponível no Guia de Bolso", cx, y + sealH * 0.7, { align: "center" });
    y += sealH + 4;
  }

  doc.setFontSize(compact ? 4 : 5);
  doc.setFont("helvetica", "normal");
  doc.setTextColor(...mutedRgb);
  const urlLines = doc.splitTextToSize(shortUrl, innerW);
  doc.text(urlLines, cx, cardY + cardH - (compact ? 5 : 7), { align: "center" });

  if (!compact && siteDomain) {
    doc.setFontSize(4);
    doc.setTextColor(...hexToRgb(QR_PDF_THEME.mutedLight));
    doc.text(siteDomain, cx, cardY + cardH - 3, { align: "center" });
  }
}

/**
 * Renderiza cartaz premium no documento jsPDF.
 * @param {import('jspdf').jsPDF} doc
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
 */
export function renderPremiumQrPdf(doc, params) {
  const format = resolveQrPdfFormat(params.format);
  const pageW = doc.internal.pageSize.getWidth();
  const pageH = doc.internal.pageSize.getHeight();

  const paperRgb = hexToRgb(QR_PDF_THEME.paper);
  doc.setFillColor(...paperRgb);
  doc.rect(0, 0, pageW, pageH, "F");

  const shortUrl = `${String(params.siteUrl || "").replace(/\/$/, "")}/q/${params.slug}`;
  const categoriaLinha = formatCategoriaLinha(params.categoria, params.subcategoria);

  let cardW = format.cardWidth || pageW - 16;
  let cardH = pageH - 16;
  let cardX = (pageW - cardW) / 2;
  let cardY = (pageH - cardH) / 2;

  if (format.id === "a4") {
    cardW = format.cardWidth || 140;
    cardH = Math.min(195, pageH - 40);
    cardX = (pageW - cardW) / 2;
    cardY = (pageH - cardH) / 2;
  } else if (format.compact) {
    cardW = pageW - 8;
    cardH = pageH - 8;
    cardX = 4;
    cardY = 4;
  } else {
    cardX = 8;
    cardY = 8;
    cardW = pageW - 16;
    cardH = pageH - 16;
  }

  renderPremiumCard(doc, {
    pageW,
    pageH,
    cardX,
    cardY,
    cardW,
    cardH,
    nome: params.nome,
    categoriaLinha,
    qrDataUrl: params.qrDataUrl,
    shortUrl,
    siteDomain: getSiteDisplayDomain(params.siteUrl),
    ehParceiro: Boolean(params.ehParceiro),
    logoDataUrl: params.logoDataUrl,
    compact: Boolean(format.compact),
  });
}
