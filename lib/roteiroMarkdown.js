/**
 * Escapa caracteres HTML especiais.
 * @param {unknown} text
 * @returns {string}
 */
function escapeHtml(text) {
  return String(text)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

/**
 * Aplica negrito markdown (`**texto**`) com escape HTML.
 * @param {string} text
 * @returns {string}
 */
function inlineFormat(text) {
  return escapeHtml(text).replace(/\*\*(.+?)\*\*/g, "<strong>$1</strong>");
}

/**
 * Detecta período do dia (manhã/tarde/noite) em uma linha de texto.
 * @param {string} line
 * @returns {'manha'|'tarde'|'noite'|null}
 */
function detectPeriod(line) {
  const lower = line.toLowerCase();
  if (/manh[ãa]/.test(lower)) return "manha";
  if (/tarde/.test(lower)) return "tarde";
  if (/noite/.test(lower)) return "noite";
  return null;
}

/**
 * Metadados visuais (rótulo, emoji, fundo) para bloco de período.
 * @param {'manha'|'tarde'|'noite'|null} period
 * @returns {{ label: string, emoji: string, bg: string }|null}
 */
function periodMeta(period) {
  if (period === "manha") {
    return { label: "Manhã", emoji: "🌅", bg: "bg-amber-50" };
  }
  if (period === "tarde") {
    return { label: "Tarde", emoji: "☀️", bg: "bg-sky-50" };
  }
  if (period === "noite") {
    return { label: "Noite", emoji: "🌙", bg: "bg-indigo-50" };
  }
  return null;
}

/**
 * Heurística: linha representa nome de lugar/etapa do roteiro.
 * @param {string} line
 * @returns {boolean}
 */
function isPlaceLine(line) {
  const trimmed = line.trim();
  return (
    /^#{1,3}\s/.test(trimmed) ||
    /^📍/.test(trimmed) ||
    /^\*\*[^*]+\*\*$/.test(trimmed) ||
    (/^[A-ZÁÉÍÓÚÂÊÔÃÕÇ]/.test(trimmed) &&
      trimmed.length < 80 &&
      !trimmed.startsWith("→") &&
      !trimmed.startsWith("-") &&
      !trimmed.startsWith("💡") &&
      !trimmed.startsWith("⏱"))
  );
}

/**
 * Remove marcadores markdown e emoji de localização do nome do lugar.
 * @param {string} line
 * @returns {string}
 */
function cleanPlaceName(line) {
  return line
    .replace(/^#{1,3}\s*/, "")
    .replace(/^📍\s*/, "")
    .replace(/^\*\*|\*\*$/g, "")
    .trim();
}

/**
 * Converte linhas de uma etapa do roteiro em bloco HTML interno.
 * @param {string[]} lines
 * @returns {string}
 */
function buildStepHtml(lines) {
  if (!lines.length) return "";

  const parts = [];
  let placeName = "";
  const activities = [];
  let tip = "";
  let duration = "";

  for (const line of lines) {
    const trimmed = line.trim();
    if (!trimmed) continue;

    if (isPlaceLine(trimmed) && !placeName) {
      placeName = cleanPlaceName(trimmed);
      continue;
    }

    if (/^⏱|^~/.test(trimmed) || /tempo|duração|duracao/i.test(trimmed)) {
      duration = trimmed.replace(/^⏱️?\s*/, "");
      continue;
    }

    if (/^💡/.test(trimmed) || /^dica:/i.test(trimmed)) {
      tip = trimmed.replace(/^💡\s*/, "").replace(/^dica:\s*/i, "");
      continue;
    }

    if (
      trimmed.startsWith("→") ||
      trimmed.startsWith("->") ||
      trimmed.startsWith("-") ||
      trimmed.startsWith("•")
    ) {
      activities.push(trimmed.replace(/^[→>-•]\s*/, ""));
      continue;
    }

    if (!placeName && trimmed.length < 90) {
      placeName = trimmed;
    } else {
      activities.push(trimmed);
    }
  }

  if (placeName) {
    parts.push(`
      <div class="flex items-start gap-2">
        <span class="mt-0.5 flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-[#1a4a3a] text-white text-xs" aria-hidden>📍</span>
        <p class="text-base font-bold text-[#1a2e28]">${inlineFormat(placeName)}</p>
      </div>
    `);
  }

  if (activities.length) {
    parts.push('<ul class="mt-3 space-y-2">');
    for (const activity of activities) {
      parts.push(`
        <li class="flex items-start gap-2 text-sm text-[#3d4f4a]">
          <span class="mt-0.5 shrink-0 font-bold text-[#1a4a3a]" aria-hidden>→</span>
          <span>${inlineFormat(activity)}</span>
        </li>
      `);
    }
    parts.push("</ul>");
  }

  if (tip) {
    parts.push(`
      <div class="mt-3 flex items-start gap-2 rounded-xl bg-[#f0f4f3] px-3 py-2.5 text-sm text-[#1a4a3a]">
        <span aria-hidden>💡</span>
        <span><strong class="font-semibold">Dica local:</strong> ${inlineFormat(tip)}</span>
      </div>
    `);
  }

  if (duration) {
    parts.push(`
      <p class="mt-2 inline-flex items-center gap-1 rounded-full bg-white px-2.5 py-1 text-xs font-semibold text-[#5a6b66] ring-1 ring-[#e3e9e6]">
        <span aria-hidden>⏱️</span> ${inlineFormat(duration)}
      </p>
    `);
  }

  return parts.join("").replace(/<\/?motion\.div>/g, (tag) =>
    tag.startsWith("</") ? "</div>" : "<div>"
  ).replace(/motion\.motion\.motion\.div/g, "div");
}

/**
 * Converte markdown do roteiro em HTML estilizado para o app.
 * @param {string} text - Conteúdo markdown gerado pela IA.
 * @returns {string} HTML seguro para `dangerouslySetInnerHTML`.
 */
export function formatRoteiroConteudo(text) {
  if (!text) return "";

  const lines = String(text).replace(/\r\n/g, "\n").split("\n");
  const html = [];
  let dayOpen = false;
  let periodOpen = false;
  let stepBuffer = [];

  function flushStep() {
    if (!stepBuffer.length) return;
    const stepHtml = buildStepHtml(stepBuffer);
    if (stepHtml) {
      html.push(
        `<div class="mt-3 rounded-2xl bg-white/95 p-4 shadow-sm ring-1 ring-black/5">${stepHtml}</div>`
      );
    }
    stepBuffer = [];
  }

  function closePeriod() {
    flushStep();
    if (periodOpen) {
      html.push("</div></div>");
      periodOpen = false;
    }
  }

  function closeDay() {
    closePeriod();
    if (dayOpen) {
      html.push("</section>");
      dayOpen = false;
    }
  }

  for (const rawLine of lines) {
    const line = rawLine.trim();
    if (!line) {
      flushStep();
      continue;
    }

    if (/^#{1}\s/.test(line) || /^dia\s+\d/i.test(line)) {
      closeDay();
      const title = line.replace(/^#\s*/, "");
      html.push(`
        <section class="roteiro-dia mb-5 overflow-hidden rounded-3xl bg-gradient-to-br from-[#1a4a3a] to-[#2d6b54] p-4 text-white shadow-md">
          <div class="flex items-center gap-2">
            <span class="text-xl" aria-hidden>🗓️</span>
            <h3 class="text-lg font-bold tracking-tight">${inlineFormat(title)}</h3>
          </div>
      `);
      dayOpen = true;
      continue;
    }

    const period = detectPeriod(line);
    if (period || /^##\s/.test(line)) {
      closePeriod();
      flushStep();
      const detected = period ?? detectPeriod(line.replace(/^##\s*/, ""));
      const meta = periodMeta(detected);
      if (meta) {
        html.push(`
          <div class="mt-4 overflow-hidden rounded-2xl bg-white shadow-sm">
            <div class="flex items-center gap-2 border-b border-gray-100 px-4 py-3 ${meta.bg}">
              <span class="text-lg" aria-hidden>${meta.emoji}</span>
              <h4 class="text-sm font-bold uppercase tracking-wide text-[#1a2e28]">${meta.label}</h4>
            </div>
            <div class="space-y-3 p-3">
        `);
        periodOpen = true;
      }
      if (!/^##\s*(manh|tarde|noite)/i.test(line)) {
        stepBuffer.push(line.replace(/^##\s*/, ""));
      }
      continue;
    }

    if (dayOpen || periodOpen) {
      stepBuffer.push(line);
    } else {
      html.push(
        `<p class="mb-2 text-sm leading-relaxed text-[#3d4f4a]">${inlineFormat(line)}</p>`
      );
    }
  }

  closeDay();

  let result = html.join("");
  result = result.replace(/<\/?motion\.motion\.motion\.div>/gi, (tag) =>
    tag.toLowerCase().startsWith("</") ? "</div>" : "<div>"
  );
  result = result.replace(/<\/?motion\.div>/gi, (tag) =>
    tag.toLowerCase().startsWith("</") ? "</div>" : "<div>"
  );
  result = result.replace(/motion\.div/gi, "div");

  if (!result.trim()) {
    return `<p class="text-sm leading-relaxed text-[#3d4f4a]">${inlineFormat(text).replace(/\n/g, "<br />")}</p>`;
  }

  return result;
}
