"use client";

import { useEffect, useState } from "react";
import QRCode from "qrcode";
import { isParceiro } from "@/lib/lugarBadges";
import { buildQrUrl, isLugarElegivelQr } from "@/lib/lugarQr";
import { downloadQrPdf } from "@/lib/qrPdf";
import { getClientSiteUrl } from "@/lib/siteUrl";
import { createClient } from "@/lib/supabase";

/**
 * Seção admin: preview do QR, URL curta e download PDF.
 * @param {{
 *   lugar: { id: string|number, nome: string, categoria?: string, slug?: string|null, status?: string },
 *   slugColumnReady?: boolean,
 * }} props
 * @returns {import("react").ReactElement|null}
 */
export default function LugarQrSection({ lugar, slugColumnReady = true }) {
  const [qrDataUrl, setQrDataUrl] = useState("");
  const [copiado, setCopiado] = useState(false);
  const [baixando, setBaixando] = useState(false);
  const ehParceiro = isParceiro(lugar);

  const elegivel = isLugarElegivelQr(lugar);
  const slug = lugar?.slug?.trim() || "";
  const siteUrl = getClientSiteUrl();
  const qrUrl = slug ? buildQrUrl(slug, siteUrl) : "";

  useEffect(() => {
    if (!elegivel || !slug) {
      setQrDataUrl("");
      return;
    }

    let cancelled = false;

    QRCode.toDataURL(qrUrl, {
      width: 240,
      margin: 1,
      color: { dark: "#1a4a3a", light: "#ffffff" },
    })
      .then((dataUrl) => {
        if (!cancelled) setQrDataUrl(dataUrl);
      })
      .catch(() => {
        if (!cancelled) setQrDataUrl("");
      });

    return () => {
      cancelled = true;
    };
  }, [elegivel, slug, qrUrl]);

  if (!elegivel) return null;

  if (!slugColumnReady) {
    return (
      <section className="mt-6 rounded-2xl border border-amber-200 bg-amber-50 p-5">
        <h3 className="text-sm font-bold uppercase tracking-wide text-amber-900">
          QR Code do estabelecimento
        </h3>
        <p className="mt-2 text-sm text-amber-950">
          Rode{" "}
          <code className="rounded bg-white px-1 py-0.5 text-xs">supabase/lugares_qr_slug.sql</code>{" "}
          no SQL Editor do Supabase para criar a coluna <code className="text-xs">slug</code> e
          gerar o PDF.
        </p>
      </section>
    );
  }

  /**
   * @returns {Promise<void>}
   */
  async function handleCopiar() {
    if (!qrUrl) return;

    try {
      await navigator.clipboard.writeText(qrUrl);
      setCopiado(true);
      setTimeout(() => setCopiado(false), 2500);
    } catch {
      // Clipboard pode falhar em contextos restritos.
    }
  }

  /**
   * @returns {Promise<void>}
   */
  async function handleBaixarPdf() {
    if (!slug || !lugar?.nome) return;

    setBaixando(true);
    try {
      await downloadQrPdf({
        nome: lugar.nome,
        categoria: lugar.categoria,
        slug,
        siteUrl,
        ehParceiro,
      });
    } finally {
      setBaixando(false);
    }
  }

  return (
    <section className="mt-6 rounded-2xl border border-[#e3e9e6] bg-[#f7faf9] p-5">
      <h3 className="text-sm font-bold uppercase tracking-wide text-[#5a6b66]">
        QR Code do estabelecimento
      </h3>
      <p className="mt-2 text-xs text-[#5a6b66]">
        Imprima e coloque na mesa ou balcão. O turista escaneia e abre o perfil no app.
      </p>

      {!slug ? (
        <p className="mt-4 rounded-xl bg-white px-4 py-3 text-sm text-[#5a6b66]">
          Salve o local para gerar o link curto e o QR Code.
        </p>
      ) : (
        <div className="mt-4 flex flex-col gap-4 md:flex-row md:items-start">
          <div className="flex shrink-0 flex-col items-center rounded-2xl bg-white p-4 shadow-sm">
            {qrDataUrl ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                src={qrDataUrl}
                alt={`QR Code de ${lugar.nome}`}
                width={160}
                height={160}
                className="h-40 w-40"
              />
            ) : (
              <div className="flex h-40 w-40 items-center justify-center text-xs text-[#5a6b66]">
                Gerando preview…
              </div>
            )}
          </div>

          <div className="min-w-0 flex-1 space-y-3">
            <div>
              <p className="text-xs font-semibold uppercase tracking-wide text-[#5a6b66]">
                URL curta
              </p>
              <p className="mt-1 break-all rounded-xl bg-white px-3 py-2 font-mono text-sm text-[#1a4a3a]">
                {qrUrl}
              </p>
            </div>

            <div className="flex flex-col gap-2 sm:flex-row">
              <button
                type="button"
                onClick={handleCopiar}
                className="rounded-xl border border-[#1a4a3a] bg-white px-4 py-2.5 text-sm font-semibold text-[#1a4a3a] transition-colors hover:bg-[#eef8f4]"
              >
                {copiado ? "Copiado!" : "Copiar link"}
              </button>
              <button
                type="button"
                onClick={handleBaixarPdf}
                disabled={baixando}
                className="rounded-xl bg-[#1a4a3a] px-4 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-[#153d30] disabled:opacity-60"
              >
                {baixando ? "Gerando PDF…" : "Baixar PDF"}
              </button>
            </div>
          </div>
        </div>
      )}
    </section>
  );
}
