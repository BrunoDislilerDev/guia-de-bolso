"use client";

import PerfilSettingRow from "@/components/perfil/PerfilSettingRow";

/**
 * Grupo de configurações com título e card único.
 * @param {object} props
 * @param {string} props.title
 * @param {Array<{ key: string, icon?: string, label: string, detail?: string, danger?: boolean, onClick?: () => void, href?: string }>} props.items
 * @returns {import("react").JSX.Element}
 */
export default function PerfilSettingsGroup({ title, items }) {
  const sectionId = `perfil-group-${title.replace(/\s+/g, "-").toLowerCase()}`;

  return (
    <section aria-labelledby={sectionId}>
      <h2
        id={sectionId}
        className="mb-2 px-1 text-xs font-bold uppercase tracking-[0.12em] text-[#5a6b66]"
      >
        {title}
      </h2>
      <div className="overflow-hidden rounded-2xl bg-white shadow-sm ring-1 ring-[#e8eeee]">
        {items.map((item, index) => (
          <div
            key={item.key}
            className={index < items.length - 1 ? "border-b border-[#f0f4f3]" : ""}
          >
            <PerfilSettingRow
              icon={item.icon}
              label={item.label}
              detail={item.detail}
              danger={item.danger}
              onClick={item.onClick}
              href={item.href}
            />
          </div>
        ))}
      </div>
    </section>
  );
}
