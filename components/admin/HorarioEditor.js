"use client";

const dias = [
  ["dom", "Domingo"],
  ["seg", "Segunda-Feira"],
  ["ter", "Terça-Feira"],
  ["qua", "Quarta-Feira"],
  ["qui", "Quinta-Feira"],
  ["sex", "Sexta-Feira"],
  ["sab", "Sábado"],
];

/**
 * Converte string de horário do banco em estado editável do editor.
 * @param {string} [value] - `"fechado"`, `"24h"` ou `"HH:MM-HH:MM"`.
 * @returns {{ fechado: boolean, vinteQuatroHoras: boolean, abertura: string, fechamento: string }}
 */
function parseHorario(value) {
  if (value === "24h") {
    return { fechado: false, vinteQuatroHoras: true, abertura: "00:00", fechamento: "23:59" };
  }

  if (!value || value === "fechado") {
    return { fechado: true, vinteQuatroHoras: false, abertura: "08:00", fechamento: "18:00" };
  }

  const [abertura = "08:00", fechamento = "18:00"] = value.split("-");
  return { fechado: false, vinteQuatroHoras: false, abertura, fechamento };
}

/**
 * Toggle acessível estilo switch para Fechado / 24h.
 * @param {object} props
 * @param {boolean} props.checked - Estado ligado.
 * @param {(next: boolean) => void} props.onChange - Callback com novo valor.
 * @param {string} props.label - Texto ao lado do switch.
 * @returns {import("react").JSX.Element}
 */
function Switch({ checked, onChange, label }) {
  return (
    <button
      type="button"
      onClick={() => onChange(!checked)}
      className="flex items-center gap-2 text-xs font-semibold text-[#1a2e28]"
      aria-pressed={checked}
    >
      <span
        className={`flex h-6 w-11 items-center rounded-full p-1 transition-colors ${
          checked ? "bg-[#1a4a3a]" : "bg-[#d8dfdc]"
        }`}
      >
        <span
          className={`h-4 w-4 rounded-full bg-white shadow-sm transition-transform ${
            checked ? "translate-x-5" : "translate-x-0"
          }`}
        />
      </span>
      {label}
    </button>
  );
}

/**
 * Input nativo `type="time"` com estilos do admin.
 * @param {object} props
 * @param {string} props.value - Valor HH:MM.
 * @param {boolean} props.disabled - Desabilita quando fechado ou 24h.
 * @param {(value: string) => void} props.onChange - Novo horário selecionado.
 * @returns {import("react").JSX.Element}
 */
function TimeInput({ value, disabled, onChange }) {
  return (
    <input
      type="time"
      value={value}
      disabled={disabled}
      onChange={(event) => onChange(event.target.value)}
      className="w-full rounded-xl border border-[#d8dfdc] bg-white px-3 py-2 text-sm text-[#1a2e28] outline-none ring-[#1a4a3a]/20 focus:ring-2 disabled:cursor-not-allowed disabled:bg-[#eef2f0] disabled:text-[#9aa8a3]"
    />
  );
}

/**
 * Grade semanal de horários de funcionamento para o admin (fechado, intervalo ou 24h).
 * @param {object} props
 * @param {Record<string, string>} [props.horarios={}] - Mapa dia → valor (`dom`, `seg`, …).
 * @param {(horarios: Record<string, string>) => void} [props.onChange] - Atualiza o objeto completo no pai.
 * @returns {import("react").JSX.Element}
 */
export default function HorarioEditor({ horarios = {}, onChange }) {
  /**
   * Atualiza o valor de um dia da semana no objeto `horarios`.
   * @param {string} key - Chave do dia (`dom`, `seg`, …).
   * @param {string} nextValue - Novo valor (`fechado`, `24h` ou intervalo).
   */
  function updateDia(key, nextValue) {
    onChange?.({
      ...horarios,
      [key]: nextValue,
    });
  }

  /**
   * Altera abertura ou fechamento e persiste como string `abertura-fechamento`.
   * @param {string} key - Chave do dia.
   * @param {"abertura"|"fechamento"} field - Campo alterado.
   * @param {string} value - Horário HH:MM.
   */
  function updateHoras(key, field, value) {
    const parsed = parseHorario(horarios[key]);
    const next = { ...parsed, [field]: value };
    updateDia(key, `${next.abertura || "08:00"}-${next.fechamento || "18:00"}`);
  }

  return (
    <div className="overflow-hidden rounded-2xl border border-[#e3e9e6]">
      <div className="hidden grid-cols-[1.2fr_1fr_1fr_auto_1fr_1fr] gap-3 bg-[#1a4a3a] px-4 py-3 text-xs font-bold uppercase tracking-wide text-white/80 md:grid">
        <span>Dia</span>
        <span>Fechado</span>
        <span>Abertura</span>
        <span>Até</span>
        <span>Fechamento</span>
        <span>24h</span>
      </div>

      {dias.map(([key, label], index) => {
        const parsed = parseHorario(horarios[key]);
        const disabled = parsed.fechado || parsed.vinteQuatroHoras;

        return (
          <div
            key={key}
            className={`grid gap-3 px-4 py-4 transition-opacity md:grid-cols-[1.2fr_1fr_1fr_auto_1fr_1fr] md:items-center ${
              index % 2 === 0 ? "bg-white" : "bg-[#f7faf9]"
            } ${parsed.fechado ? "opacity-60" : "opacity-100"}`}
          >
            <div className="text-sm font-bold text-[#1a2e28]">{label}</div>
            <Switch
              checked={parsed.fechado}
              label="Fechado"
              onChange={(checked) => updateDia(key, checked ? "fechado" : "08:00-18:00")}
            />
            <TimeInput
              value={parsed.abertura}
              disabled={disabled}
              onChange={(value) => updateHoras(key, "abertura", value)}
            />
            <span className="text-center text-xs font-semibold uppercase text-[#5a6b66]">
              até
            </span>
            <TimeInput
              value={parsed.fechamento}
              disabled={disabled}
              onChange={(value) => updateHoras(key, "fechamento", value)}
            />
            <Switch
              checked={parsed.vinteQuatroHoras}
              label="24h"
              onChange={(checked) => updateDia(key, checked ? "24h" : "08:00-18:00")}
            />
          </div>
        );
      })}
    </div>
  );
}
