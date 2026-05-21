"use client";

import Link from "next/link";

/**
 * @param {object} props
 * @param {string} props.label
 * @param {number|string} props.value
 * @param {string} [props.hint]
 * @param {{ text: string, className: string, direction?: string }} props.variation
 * @param {import("react").ComponentType<{ className?: string }>} props.icon
 * @param {string} props.iconWrap
 * @param {string} props.iconColor
 * @param {string} [props.href]
 * @param {boolean} [props.hero]
 * @param {string} [props.className]
 * @returns {import("react").JSX.Element}
 */
export default function DashboardMetricCard({
  label,
  value,
  hint,
  variation,
  icon: Icon,
  iconWrap,
  iconColor,
  href,
  hero = false,
  className = "",
}) {
  const articleClass = `flex h-full min-h-[148px] flex-col rounded-3xl bg-white shadow-md shadow-[#1a4a3a]/5 ring-1 ring-black/5 transition-shadow ${
    href ? "hover:shadow-lg" : ""
  } ${hero ? "min-h-[200px] p-8 md:p-10" : "p-6 md:p-8"}`;

  const content = (
    <article className={articleClass}>
      <div className="flex items-start justify-between gap-4">
        <div className="min-w-0 flex-1">
          <p
            className={`font-bold tabular-nums tracking-tight text-[#1a2e28] ${
              hero ? "text-5xl md:text-6xl" : "text-4xl md:text-5xl"
            }`}
          >
            {value}
          </p>
          <p className={`mt-2 font-semibold text-[#1a2e28] ${hero ? "text-lg" : "text-base"}`}>
            {label}
          </p>
          {hint && <p className="mt-1 text-sm text-[#5a6b66]">{hint}</p>}
        </div>
        <div
          className={`flex shrink-0 items-center justify-center rounded-2xl ${iconWrap} ${
            hero ? "h-14 w-14 md:h-16 md:w-16" : "h-12 w-12 md:h-14 md:w-14"
          }`}
        >
          <Icon className={`${iconColor} ${hero ? "h-7 w-7 md:h-8 md:w-8" : "h-6 w-6 md:h-7 md:w-7"}`} />
        </div>
      </div>

      <div className={`mt-auto border-t border-[#eef3f1] ${hero ? "pt-6" : "pt-5"}`}>
        <p className={`text-sm font-bold ${variation.className}`}>{variation.text}</p>
      </div>
    </article>
  );

  const wrapperClass = `h-full min-w-0 ${className}`.trim();

  if (href) {
    return (
      <Link
        href={href}
        className={`${wrapperClass} block focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#1a4a3a]/30 rounded-3xl`}
      >
        {content}
      </Link>
    );
  }

  return <div className={wrapperClass}>{content}</div>;
}
