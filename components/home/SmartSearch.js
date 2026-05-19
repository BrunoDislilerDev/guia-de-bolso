"use client";

import { memo, useCallback, useState } from "react";
import { QUICK_SEARCH_CHIPS } from "@/lib/homeContext";

/**
 * IconSparkle - Sparkle icon for AI search branding.
 * @param {object} props
 * @param {string} [props.className]
 * @returns {import('react').ReactElement}
 */
function IconSparkle({ className = "h-4 w-4" }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="currentColor" aria-hidden>
      <path d="M12 2l1.2 4.2L17.4 7.4 13.2 8.6 12 12.8 10.8 8.6 6.6 7.4 10.8 4.2 12 2zm7 9l.9 3.1 3.1.9-3.1.9-.9 3.1-.9-3.1-3.1-.9 3.1-.9.9-3.1zm-14 0l.7 2.4 2.4.7-2.4.7-.7 2.4-.7-2.4-2.4-.7 2.4-.7.7-2.4z" />
    </svg>
  );
}

/**
 * IconSend - Send/submit icon for the search button.
 * @param {object} props
 * @param {string} [props.className]
 * @returns {import('react').ReactElement}
 */
function IconSend({ className = "h-4 w-4" }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="currentColor" aria-hidden>
      <path d="M3.4 20.4l17.45-7.17a1 1 0 000-1.83L3.4 4.6a1 1 0 00-1.28 1.28l3.07 7.12-3.07 7.12a1 1 0 001.28 1.28z" />
    </svg>
  );
}

/**
 * IconClose - Close icon for exiting search mode.
 * @param {object} props
 * @param {string} [props.className]
 * @returns {import('react').ReactElement}
 */
function IconClose({ className = "h-3.5 w-3.5" }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="currentColor" aria-hidden>
      <path d="M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12z" />
    </svg>
  );
}

/**
 * QuickChip - Suggested quick-search chip button.
 * @param {object} props
 * @param {object} props.chip - Chip config with id, label, and emoji.
 * @param {(chip: object) => void} props.onClick - Called when the chip is pressed.
 * @returns {import('react').ReactElement}
 */
const QuickChip = memo(function QuickChip({ chip, onClick }) {
  return (
    <button
      type="button"
      onClick={() => onClick(chip)}
      className="flex shrink-0 snap-start items-center gap-1.5 rounded-full border border-white/80 bg-white px-3.5 py-2 text-xs font-medium text-[#1a4a3a] shadow-[0_2px_8px_rgba(26,74,58,0.08)] ring-1 ring-[#d8ebe4]/80 transition-all active:scale-[0.97] active:bg-[#f4faf7]"
    >
      <span className="text-sm leading-none" aria-hidden>
        {chip.emoji}
      </span>
      <span className="whitespace-nowrap">{chip.label}</span>
    </button>
  );
});

/**
 * SmartSearch - AI-powered search input with quick suggestion chips.
 * @param {object} props
 * @param {import('react').RefObject<HTMLFormElement>} props.searchContainerRef - Ref for the search form.
 * @param {import('react').RefObject<HTMLInputElement>} props.searchInputRef - Ref for the search input.
 * @param {string} props.termoBusca - Current search query value.
 * @param {boolean} props.searchMode - Whether expanded search mode is active.
 * @param {(e: import('react').FormEvent) => void} props.onSubmit - Form submit handler.
 * @param {(e: import('react').FocusEvent) => void} [props.onFocus] - Input focus handler.
 * @param {(e: import('react').FocusEvent) => void} [props.onBlur] - Input blur handler.
 * @param {(value: string) => void} props.onChange - Query change handler.
 * @param {() => void} props.onClose - Closes search mode.
 * @param {(chip: object) => void} props.onChipClick - Quick chip click handler.
 * @param {boolean} [props.showChips] - Whether to show quick suggestion chips.
 * @returns {import('react').ReactElement}
 */
function SmartSearch({
  searchContainerRef,
  searchInputRef,
  termoBusca,
  searchMode,
  onSubmit,
  onFocus,
  onBlur,
  onChange,
  onClose,
  onChipClick,
  showChips = true,
}) {
  const [focused, setFocused] = useState(false);

  /**
   * Forwards quick chip selection to the parent handler.
   * @param {object} chip - Quick search chip config.
   * @returns {void}
   */
  const handleChip = useCallback((chip) => onChipClick(chip), [onChipClick]);

  /**
   * Marks the search field as focused and forwards the focus event.
   * @param {import('react').FocusEvent} e - Focus event.
   * @returns {void}
   */
  const handleFocus = useCallback(
    (e) => {
      setFocused(true);
      onFocus?.(e);
    },
    [onFocus]
  );

  /**
   * Marks the search field as blurred and forwards the blur event.
   * @param {import('react').FocusEvent} e - Blur event.
   * @returns {void}
   */
  const handleBlur = useCallback(
    (e) => {
      setFocused(false);
      onBlur?.(e);
    },
    [onBlur]
  );

  const hasQuery = termoBusca.trim().length > 0;
  const active = focused || searchMode;

  return (
    <section className="relative z-10 mb-4">
      <form ref={searchContainerRef} onSubmit={onSubmit}>
        <div
          className={`rounded-[20px] p-px transition-all duration-300 ease-out ${
            active
              ? "bg-gradient-to-r from-[#1a4a3a] via-[#2a6b55] to-[#3d8f72] shadow-[0_8px_28px_-6px_rgba(26,74,58,0.35)]"
              : "bg-gradient-to-r from-[#c8ddd4] via-[#d4e8df] to-[#c8ddd4] shadow-[0_2px_12px_-4px_rgba(26,74,58,0.12)]"
          }`}
        >
          <div className="overflow-hidden rounded-[19px] bg-gradient-to-b from-white to-[#f8fcfa]">
            <div className="flex items-center gap-2.5 px-3 py-2.5">
              <div
                className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-xl transition-colors duration-300 ${
                  active
                    ? "bg-gradient-to-br from-[#1a4a3a] to-[#2d6b54] text-white shadow-sm"
                    : "bg-[#eef6f2] text-[#1a4a3a]"
                }`}
              >
                <IconSparkle className="h-[18px] w-[18px]" />
              </div>

              <div className="relative min-w-0 flex-1">
                <label htmlFor="smart-search-input" className="sr-only">
                  Busca inteligente com IA
                </label>
                <p
                  className={`text-[10px] font-semibold uppercase tracking-[0.14em] text-[#1a4a3a]/45 transition-all duration-200 ${
                    active ? "mb-0.5 h-0 overflow-hidden opacity-0" : "mb-0.5"
                  }`}
                  aria-hidden={active}
                >
                  Pergunte à IA
                </p>
                <input
                  id="smart-search-input"
                  ref={searchInputRef}
                  type="search"
                  enterKeyHint="search"
                  autoComplete="off"
                  autoCorrect="off"
                  spellCheck={false}
                  value={termoBusca}
                  onFocus={handleFocus}
                  onBlur={handleBlur}
                  onChange={(e) => onChange(e.target.value)}
                  placeholder="O que fazer agora?"
                  className={`w-full bg-transparent text-[15px] leading-snug text-[#1a2e28] placeholder:text-[#9aa8a3]/90 focus:outline-none ${
                    searchMode ? "pr-8" : ""
                  }`}
                />
                {searchMode && (
                  <button
                    type="button"
                    onClick={onClose}
                    className="absolute right-0 top-1/2 flex h-11 w-11 -translate-y-1/2 items-center justify-center rounded-full text-[#5a6b66] transition-colors active:bg-[#eef3f1]"
                    aria-label="Fechar busca"
                  >
                    <IconClose />
                  </button>
                )}
              </div>

              <button
                type="submit"
                aria-label="Buscar"
                className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-xl transition-all duration-200 active:scale-95 ${
                  hasQuery || active
                    ? "bg-[#1a4a3a] text-white shadow-md shadow-[#1a4a3a]/25"
                    : "bg-[#e8f0ec] text-[#9aa8a3]"
                }`}
              >
                <IconSend className="h-[17px] w-[17px] -rotate-45" />
              </button>
            </div>
          </div>
        </div>
      </form>

      {showChips && !searchMode && (
        <div className="relative mt-3 -mx-1">
          <div
            className="pointer-events-none absolute inset-y-0 left-0 z-10 w-5 bg-gradient-to-r from-[#f0f4f3] via-[#f0f4f3]/80 to-transparent"
            aria-hidden
          />
          <div
            className="pointer-events-none absolute inset-y-0 right-0 z-10 w-10 bg-gradient-to-l from-[#f0f4f3] via-[#f0f4f3]/80 to-transparent"
            aria-hidden
          />
          <div
            className="flex gap-2 overflow-x-auto scroll-smooth px-1 pb-0.5 scrollbar-hide snap-x snap-mandatory [-webkit-overflow-scrolling:touch]"
            role="list"
            aria-label="Sugestões rápidas"
          >
            {QUICK_SEARCH_CHIPS.map((chip) => (
              <QuickChip key={chip.id} chip={chip} onClick={handleChip} />
            ))}
          </div>
        </div>
      )}
    </section>
  );
}

export default memo(SmartSearch);
