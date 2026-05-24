"use client";

import { useEffect, useMemo, useState } from "react";
import {
  intervaloCruzaMeiaNoite,
  minutesToTime,
  parseHorarioDia,
  serializeHorarioDia,
  timeToMinutes,
  validarIntervalos,
} from "@/lib/horarios";

const dias = [
  ["dom", "Domingo"],
  ["seg", "Segunda-Feira"],
  ["ter", "Terça-Feira"],
  ["qua", "Quarta-Feira"],
  ["qui", "Quinta-Feira"],
  ["sex", "Sexta-Feira"],
  ["sab", "Sábado"],
];

const DIAS_CURTOS = {
  dom: "Dom",
  seg: "Seg",
  ter: "Ter",
  qua: "Qua",
  qui: "Qui",
  sex: "Sex",
  sab: "Sáb",
};

const SEG_SEX = ["seg", "ter", "qua", "qui", "sex"];
const TODOS_DIAS = dias.map(([key]) => key);

/**
 * Sugere horário do turno 2 começando após o fim do turno 1.
 * @param {{ inicio: string, fim: string }} turno1
 * @returns {{ inicio: string, fim: string }}
 */
function sugerirTurno2(turno1) {
  const fim1 = timeToMinutes(turno1.fim) ?? 18 * 60;

  if (intervaloCruzaMeiaNoite(turno1.inicio, turno1.fim)) {
    return { inicio: "12:00", fim: "15:00" };
  }

  let inicio2 = fim1;
  if (inicio2 >= 22 * 60) {
    inicio2 = 18 * 60;
  }

  let fim2 = Math.min(inicio2 + 4 * 60, 23 * 60 + 59);
  if (fim2 <= inicio2) {
    fim2 = Math.min(inicio2 + 2 * 60, 23 * 60 + 59);
  }

  return {
    inicio: minutesToTime(inicio2),
    fim: minutesToTime(fim2),
  };
}

/**
 * Estado editável de um dia com até dois turnos.
 * @param {string} [value]
 * @returns {{ fechado: boolean, vinteQuatroHoras: boolean, doisTurnos: boolean, intervalos: Array<{ inicio: string, fim: string }> }}
 */
function parseDiaEditor(value) {
  const parsed = parseHorarioDia(value);

  if (parsed.fechado) {
    return {
      fechado: true,
      vinteQuatroHoras: false,
      doisTurnos: false,
      intervalos: [
        { inicio: "08:00", fim: "18:00" },
        { inicio: "18:00", fim: "22:00" },
      ],
    };
  }

  if (parsed.vinteQuatroHoras) {
    return {
      fechado: false,
      vinteQuatroHoras: true,
      doisTurnos: false,
      intervalos: [
        { inicio: "00:00", fim: "23:59" },
        { inicio: "18:00", fim: "22:00" },
      ],
    };
  }

  const intervalos =
    parsed.intervalos.length > 0
      ? parsed.intervalos.map((item) => ({
          inicio: item.inicio || "08:00",
          fim: item.fim || "18:00",
        }))
      : [{ inicio: "08:00", fim: "18:00" }];

  while (intervalos.length < 2) {
    intervalos.push(sugerirTurno2(intervalos[0]));
  }

  return {
    fechado: false,
    vinteQuatroHoras: false,
    doisTurnos: parsed.intervalos.length >= 2,
    intervalos,
  };
}

/**
 * @param {{ fechado: boolean, vinteQuatroHoras: boolean, doisTurnos: boolean, intervalos: Array<{ inicio: string, fim: string }> }} state
 * @returns {{ value: string, erro?: string }}
 */
function serializeDiaEditor(state) {
  if (state.fechado) return { value: "fechado" };
  if (state.vinteQuatroHoras) return { value: "24h" };

  const intervalos = state.doisTurnos
    ? [state.intervalos[0], state.intervalos[1]]
    : [state.intervalos[0]];

  const validation = validarIntervalos(intervalos);
  if (!validation.valid) {
    return { value: serializeHorarioDia({ fechado: false, vinteQuatroHoras: false, intervalos }), erro: validation.error };
  }

  return {
    value: serializeHorarioDia({
      fechado: false,
      vinteQuatroHoras: false,
      intervalos,
    }),
  };
}

/**
 * Toggle acessível estilo switch para Fechado / 24h.
 * @param {object} props
 * @param {boolean} props.checked
 * @param {(next: boolean) => void} props.onChange
 * @param {string} props.label
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
 * @param {string} props.value
 * @param {boolean} props.disabled
 * @param {(value: string) => void} props.onChange
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
 * Grade semanal de horários (fechado, 24h, um ou dois turnos por dia).
 * @param {object} props
 * @param {Record<string, string>} [props.horarios={}]
 * @param {(horarios: Record<string, string>) => void} [props.onChange]
 * @returns {import("react").JSX.Element}
 */
export default function HorarioEditor({ horarios = {}, onChange }) {
  const [copySource, setCopySource] = useState("seg");
  const [copyTargets, setCopyTargets] = useState([]);
  const [copyMessage, setCopyMessage] = useState("");
  /** Rascunho local por dia — mantém edição mesmo quando validação ainda falha. */
  const [draftByDay, setDraftByDay] = useState({});

  useEffect(() => {
    setDraftByDay({});
  }, [horarios]);

  /**
   * @param {string} key
   * @returns {ReturnType<typeof parseDiaEditor>}
   */
  function getDiaState(key) {
    return draftByDay[key] ?? parseDiaEditor(horarios[key]);
  }

  const errosPorDia = useMemo(() => {
    const map = {};
    for (const [key] of dias) {
      const state = getDiaState(key);
      if (state.fechado || state.vinteQuatroHoras) continue;
      const { erro } = serializeDiaEditor(state);
      if (erro) map[key] = erro;
    }
    return map;
  }, [horarios, draftByDay]);

  /**
   * @param {string} key
   * @param {string} nextValue
   */
  function updateDia(key, nextValue) {
    onChange?.({
      ...horarios,
      [key]: nextValue,
    });
  }

  /**
   * @param {string} key
   * @param {(state: ReturnType<typeof parseDiaEditor>) => ReturnType<typeof parseDiaEditor>} updater
   */
  function updateDiaState(key, updater) {
    const current = getDiaState(key);
    const nextState = updater(current);
    const { value, erro } = serializeDiaEditor(nextState);

    if (erro) {
      setDraftByDay((prev) => ({ ...prev, [key]: nextState }));
      return;
    }

    setDraftByDay((prev) => {
      if (!prev[key]) return prev;
      const next = { ...prev };
      delete next[key];
      return next;
    });
    updateDia(key, value);
  }

  /**
   * @param {string} sourceKey
   * @param {string[]} targetKeys
   */
  function copiarHorario(sourceKey, targetKeys) {
    const value = horarios[sourceKey] ?? "fechado";
    if (!targetKeys.length) {
      setCopyMessage("Selecione pelo menos um dia de destino.");
      return;
    }

    const next = { ...horarios };
    for (const key of targetKeys) {
      if (key !== sourceKey) next[key] = value;
    }
    onChange?.(next);
    setCopyMessage(`Horário de ${DIAS_CURTOS[sourceKey] || sourceKey} aplicado em ${targetKeys.length} dia(s).`);
  }

  /**
   * @param {string} key
   */
  function toggleCopyTarget(key) {
    setCopyTargets((current) =>
      current.includes(key) ? current.filter((item) => item !== key) : [...current, key]
    );
  }

  return (
    <div className="space-y-4">
      <div className="rounded-2xl border border-[#e3e9e6] bg-[#f7faf9] p-4">
        <p className="text-sm font-bold text-[#1a2e28]">Copiar horário entre dias</p>
        <p className="mt-1 text-xs text-[#5a6b66]">
          Inclui fechado, 24h ou vários turnos no mesmo dia.
        </p>

        <div className="mt-3 flex flex-wrap gap-2">
          <button
            type="button"
            onClick={() => copiarHorario("seg", SEG_SEX.filter((key) => key !== "seg"))}
            className="rounded-xl bg-white px-3 py-2 text-xs font-semibold text-[#1a4a3a] shadow-sm ring-1 ring-[#d8dfdc]"
          >
            Segunda → ter–sex
          </button>
          <button
            type="button"
            onClick={() => {
              if (window.confirm("Aplicar o horário de segunda em todos os dias da semana?")) {
                copiarHorario("seg", TODOS_DIAS.filter((key) => key !== "seg"));
              }
            }}
            className="rounded-xl bg-white px-3 py-2 text-xs font-semibold text-[#1a4a3a] shadow-sm ring-1 ring-[#d8dfdc]"
          >
            Segunda → todos os dias
          </button>
        </div>

        <div className="mt-4 grid gap-3 md:grid-cols-[auto_1fr_auto] md:items-end">
          <label className="block text-xs font-semibold text-[#1a2e28]">
            Copiar de
            <select
              value={copySource}
              onChange={(event) => setCopySource(event.target.value)}
              className="mt-1 w-full rounded-xl border border-[#d8dfdc] bg-white px-3 py-2 text-sm"
            >
              {dias.map(([key, label]) => (
                <option key={key} value={key}>
                  {label}
                </option>
              ))}
            </select>
          </label>

          <div>
            <p className="text-xs font-semibold text-[#1a2e28]">Para</p>
            <div className="mt-1 flex flex-wrap gap-2">
              {dias.map(([key]) => (
                <label key={key} className="flex items-center gap-1 text-xs text-[#5a6b66]">
                  <input
                    type="checkbox"
                    checked={copyTargets.includes(key)}
                    disabled={key === copySource}
                    onChange={() => toggleCopyTarget(key)}
                  />
                  {DIAS_CURTOS[key]}
                </label>
              ))}
            </div>
          </div>

          <button
            type="button"
            onClick={() => copiarHorario(copySource, copyTargets)}
            className="rounded-xl bg-[#1a4a3a] px-4 py-2 text-xs font-bold text-white"
          >
            Aplicar
          </button>
        </div>

        {copyMessage && (
          <p className="mt-2 text-xs font-semibold text-[#1a4a3a]">{copyMessage}</p>
        )}
      </div>

      <div className="overflow-hidden rounded-2xl border border-[#e3e9e6]">
        {dias.map(([key, label], index) => {
          const state = getDiaState(key);
          const disabled = state.fechado || state.vinteQuatroHoras;
          const erro = errosPorDia[key];

          return (
            <div
              key={key}
              className={`border-b border-[#e3e9e6] px-4 py-4 last:border-b-0 ${
                index % 2 === 0 ? "bg-white" : "bg-[#f7faf9]"
              } ${state.fechado ? "opacity-60" : "opacity-100"}`}
            >
              <div className="flex flex-wrap items-center justify-between gap-2">
                <div className="text-sm font-bold text-[#1a2e28]">{label}</div>
                <div className="flex flex-wrap items-center gap-4">
                  <Switch
                    checked={state.fechado}
                    label="Fechado"
                    onChange={(checked) =>
                      updateDiaState(key, (current) => ({
                        ...current,
                        fechado: checked,
                        vinteQuatroHoras: checked ? false : current.vinteQuatroHoras,
                      }))
                    }
                  />
                  <Switch
                    checked={state.vinteQuatroHoras}
                    label="24h"
                    onChange={(checked) =>
                      updateDiaState(key, (current) => ({
                        ...current,
                        vinteQuatroHoras: checked,
                        fechado: checked ? false : current.fechado,
                        doisTurnos: checked ? false : current.doisTurnos,
                      }))
                    }
                  />
                  {!disabled && (
                    <Switch
                      checked={state.doisTurnos}
                      label="Dois turnos"
                      onChange={(checked) =>
                        updateDiaState(key, (current) => {
                          const intervalos = [...current.intervalos];
                          while (intervalos.length < 2) {
                            intervalos.push(sugerirTurno2(intervalos[0]));
                          }

                          return {
                            ...current,
                            doisTurnos: checked,
                            intervalos: checked
                              ? intervalos
                              : [intervalos[0], intervalos[1] ?? sugerirTurno2(intervalos[0])],
                          };
                        })
                      }
                    />
                  )}
                </div>
              </div>

              {!disabled && (
                <div className="mt-3 space-y-3">
                  <div className="grid gap-2 sm:grid-cols-[auto_1fr_auto_1fr] sm:items-center">
                    <span className="text-xs font-semibold text-[#5a6b66]">Turno 1</span>
                    <TimeInput
                      value={state.intervalos[0].inicio}
                      disabled={disabled}
                      onChange={(value) =>
                        updateDiaState(key, (current) => ({
                          ...current,
                          intervalos: [
                            { ...current.intervalos[0], inicio: value },
                            current.intervalos[1],
                          ],
                        }))
                      }
                    />
                    <span className="text-center text-xs font-semibold uppercase text-[#5a6b66]">
                      até
                    </span>
                    <TimeInput
                      value={state.intervalos[0].fim}
                      disabled={disabled}
                      onChange={(value) =>
                        updateDiaState(key, (current) => ({
                          ...current,
                          intervalos: [
                            { ...current.intervalos[0], fim: value },
                            current.intervalos[1],
                          ],
                        }))
                      }
                    />
                  </div>

                  {state.doisTurnos && (
                    <div className="grid gap-2 sm:grid-cols-[auto_1fr_auto_1fr] sm:items-center">
                      <span className="text-xs font-semibold text-[#5a6b66]">Turno 2</span>
                      <TimeInput
                        value={state.intervalos[1].inicio}
                        disabled={disabled}
                        onChange={(value) =>
                          updateDiaState(key, (current) => ({
                            ...current,
                            intervalos: [
                              current.intervalos[0],
                              { ...current.intervalos[1], inicio: value },
                            ],
                          }))
                        }
                      />
                      <span className="text-center text-xs font-semibold uppercase text-[#5a6b66]">
                        até
                      </span>
                      <TimeInput
                        value={state.intervalos[1].fim}
                        disabled={disabled}
                        onChange={(value) =>
                          updateDiaState(key, (current) => ({
                            ...current,
                            intervalos: [
                              current.intervalos[0],
                              { ...current.intervalos[1], fim: value },
                            ],
                          }))
                        }
                      />
                    </div>
                  )}

                  {(state.doisTurnos
                    ? intervaloCruzaMeiaNoite(
                        state.intervalos[1].inicio,
                        state.intervalos[1].fim
                      )
                    : intervaloCruzaMeiaNoite(
                        state.intervalos[0].inicio,
                        state.intervalos[0].fim
                      )) && (
                      <p className="text-xs font-medium text-[#1a4a3a]">
                        Fechamento após meia-noite (dia seguinte).
                      </p>
                    )}
                </div>
              )}

              {erro && (
                <p className="mt-2 text-xs font-semibold text-[#d9534f]">{erro}</p>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
