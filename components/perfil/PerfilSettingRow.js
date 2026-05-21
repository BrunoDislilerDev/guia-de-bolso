"use client";

import Link from "next/link";

/**
 * Linha de configuração tocável.
 * @param {object} props
 * @param {string} [props.icon]
 * @param {string} props.label
 * @param {string} [props.detail]
 * @param {boolean} [props.danger]
 * @param {() => void} [props.onClick]
 * @param {string} [props.href]
 * @returns {import("react").JSX.Element}
 */
export default function PerfilSettingRow({
  icon,
  label,
  detail,
  danger = false,
  onClick,
  href,
}) {
  const className = `flex w-full items-center gap-3 px-4 py-3.5 text-left transition-colors ${
    danger ? "hover:bg-red-50/80" : "hover:bg-[#f0f4f3]/80"
  }`;

  const inner = (
    <>
      {icon && (
        <span
          className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-[#f0f4f3] text-lg"
          aria-hidden
        >
          {icon}
        </span>
      )}
      <span className="min-w-0 flex-1">
        <span
          className={`block text-sm font-semibold ${
            danger ? "text-[#d9534f]" : "text-[#1a2e28]"
          }`}
        >
          {label}
        </span>
        {detail && (
          <span className="mt-0.5 block truncate text-xs text-[#5a6b66]">
            {detail}
          </span>
        )}
      </span>
      <span
        className={`shrink-0 text-sm ${danger ? "text-[#d9534f]" : "text-[#9aa8a3]"}`}
        aria-hidden
      >
        →
      </span>
    </>
  );

  if (href) {
    return (
      <Link href={href} className={className}>
        {inner}
      </Link>
    );
  }

  return (
    <button type="button" onClick={onClick} className={className}>
      {inner}
    </button>
  );
}
