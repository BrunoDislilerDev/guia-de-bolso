"use client";

import { useEffect, useState } from "react";
import {
  MAX_COMENTARIO_AVALIACAO,
  getAspectosParaLugar,
} from "@/lib/avaliacaoAspectos";
import { createClient } from "@/lib/supabase";

/**
 * @param {object} props
 * @returns {import("react").JSX.Element}
 */
function Spinner() {
  return (
    <div
      className="h-5 w-5 animate-spin rounded-full border-2 border-white/30 border-t-white"
      aria-hidden
    />
  );
}

/**
 * Bottom sheet para enviar avaliação de um lugar.
 * @param {object} props
 * @param {boolean} props.isOpen
 * @param {() => void} props.onClose
 * @param {object} props.lugar - Lugar sendo avaliado (`id`, `nome`, `categoria`, `subcategoria`).
 * @param {() => void} props.onSuccess - Callback após envio e análise iniciada.
 * @returns {import("react").JSX.Element|null}
 */
export default function AvaliacaoForm({ isOpen, onClose, lugar, onSuccess }) {
  const [nota, setNota] = useState(0);
  const [aspectos, setAspectos] = useState([]);
  const [comentario, setComentario] = useState("");
  const [enviando, setEnviando] = useState(false);
  const [erro, setErro] = useState("");

  const opcoesAspectos = getAspectosParaLugar(lugar);
  const restantes = MAX_COMENTARIO_AVALIACAO - comentario.length;

  useEffect(() => {
    if (!isOpen) return undefined;

    function handleEscape(event) {
      if (event.key === "Escape" && !enviando) onClose();
    }

    window.addEventListener("keydown", handleEscape);
    return () => window.removeEventListener("keydown", handleEscape);
  }, [isOpen, enviando, onClose]);

  useEffect(() => {
    if (!isOpen) {
      setNota(0);
      setAspectos([]);
      setComentario("");
      setErro("");
      setEnviando(false);
    }
  }, [isOpen]);

  /**
   * @param {string} aspecto
   */
  function toggleAspecto(aspecto) {
    setAspectos((current) =>
      current.includes(aspecto)
        ? current.filter((item) => item !== aspecto)
        : [...current, aspecto]
    );
  }

  /**
   * @returns {Promise<void>}
   */
  async function handleSubmit() {
    if (!lugar?.id || nota < 1) return;

    setEnviando(true);
    setErro("");

    const supabase = createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      setEnviando(false);
      setErro("Faça login para enviar sua avaliação.");
      return;
    }

    const { data: inserted, error } = await supabase
      .from("avaliacoes")
      .insert({
        lugar_id: lugar.id,
        user_id: user.id,
        nota,
        comentario: comentario.trim() || null,
        aspectos,
        status: "pendente",
      })
      .select("id")
      .single();

    if (error || !inserted?.id) {
      setEnviando(false);
      setErro("Não foi possível enviar. Tente novamente.");
      return;
    }

    fetch("/api/avaliacoes/analisar", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      credentials: "same-origin",
      body: JSON.stringify({ avaliacao_id: inserted.id }),
    }).catch(() => undefined);

    setEnviando(false);
    onSuccess();
    onClose();
  }

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-end bg-black/55 backdrop-blur-sm"
      onClick={() => !enviando && onClose()}
    >
      <style>{`
        @keyframes avaliacaoSheetIn {
          from { transform: translateY(100%); }
          to { transform: translateY(0); }
        }
      `}</style>

      <div
        className="max-h-[92vh] w-full overflow-y-auto rounded-t-[24px] bg-white px-5 pb-[max(1.5rem,env(safe-area-inset-bottom))] pt-3 shadow-2xl"
        onClick={(event) => event.stopPropagation()}
        style={{ animation: "avaliacaoSheetIn 240ms ease-out" }}
        role="dialog"
        aria-modal="true"
        aria-labelledby="avaliacao-form-title"
      >
        <div className="mx-auto mb-4 h-1.5 w-12 rounded-full bg-[#d8dfdc]" />

        <h2 id="avaliacao-form-title" className="text-lg font-bold text-[#1a2e28]">
          Avaliar {lugar?.nome || "este lugar"}
        </h2>
        <p className="mt-1 text-sm text-[#5a6b66]">
          Sua opinião ajuda outros viajantes na região.
        </p>

        <div className="mt-6">
          <p className="text-sm font-semibold text-[#1a2e28]">
            Nota <span className="text-[#d9534f]">*</span>
          </p>
          <div className="mt-3 flex justify-center gap-2">
            {[1, 2, 3, 4, 5].map((value) => (
              <button
                key={value}
                type="button"
                onClick={() => setNota(value)}
                className={`text-4xl transition-transform active:scale-95 ${
                  value <= nota ? "text-amber-400" : "text-gray-200"
                }`}
                aria-label={`${value} estrela${value > 1 ? "s" : ""}`}
              >
                ★
              </button>
            ))}
          </div>
        </div>

        <div className="mt-6">
          <p className="text-sm font-semibold text-[#1a2e28]">O que mais marcou?</p>
          <p className="mt-0.5 text-xs text-[#9aa8a3]">Selecione quantos quiser</p>
          <div className="mt-3 flex flex-wrap gap-2">
            {opcoesAspectos.map((aspecto) => {
              const selected = aspectos.includes(aspecto);
              return (
                <button
                  key={aspecto}
                  type="button"
                  onClick={() => toggleAspecto(aspecto)}
                  className={`rounded-full px-3 py-1.5 text-xs font-semibold transition-colors ${
                    selected
                      ? "bg-[#1a4a3a] text-white"
                      : "bg-gray-100 text-gray-700"
                  }`}
                >
                  {aspecto}
                </button>
              );
            })}
          </div>
        </div>

        <div className="mt-6">
          <label className="text-sm font-semibold text-[#1a2e28]" htmlFor="avaliacao-comentario">
            Comentário
          </label>
          <textarea
            id="avaliacao-comentario"
            value={comentario}
            maxLength={MAX_COMENTARIO_AVALIACAO}
            onChange={(event) => setComentario(event.target.value)}
            placeholder="Conte sua experiência (opcional)"
            rows={4}
            className="mt-2 w-full resize-none rounded-xl bg-[#f0f4f3] p-3 text-sm text-[#1a2e28] outline-none ring-[#1a4a3a]/20 focus:ring-2"
          />
          <p className="mt-1 text-right text-xs text-[#9aa8a3]">
            {restantes} caracteres restantes
          </p>
        </div>

        {erro && (
          <p className="mt-4 rounded-xl bg-red-50 px-3 py-2 text-sm text-red-700" role="alert">
            {erro}
          </p>
        )}

        <button
          type="button"
          onClick={handleSubmit}
          disabled={nota < 1 || enviando}
          className="mt-6 flex w-full items-center justify-center gap-2 rounded-xl bg-[#1a4a3a] py-3.5 text-sm font-semibold text-white disabled:opacity-50"
        >
          {enviando ? (
            <>
              <Spinner />
              Enviando...
            </>
          ) : (
            "Enviar avaliação"
          )}
        </button>
      </div>
    </div>
  );
}
