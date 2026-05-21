"use client";

import Link from "next/link";
import { AdminNavIcon, isAdminNavActive } from "@/components/admin/adminNavConfig";

/**
 * @param {object} props
 * @param {import("@/components/admin/adminNavConfig").AdminNavLink} props.link
 * @param {string} props.pathname
 * @param {boolean} [props.collapsed]
 * @param {() => void} [props.onNavigate]
 * @returns {import("react").JSX.Element}
 */
export default function AdminNavLinkItem({ link, pathname, collapsed = false, onNavigate }) {
  const active = isAdminNavActive(pathname, link.href);

  return (
    <Link
      href={link.href}
      onClick={onNavigate}
      title={collapsed ? link.label : undefined}
      aria-current={active ? "page" : undefined}
      className={`group flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-semibold transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#d4ede8]/60 ${
        active
          ? "border-l-[3px] border-[#d4ede8] bg-white/12 pl-[9px] text-white shadow-sm ring-1 ring-inset ring-white/10"
          : "border-l-[3px] border-transparent text-white/72 hover:bg-white/8 hover:text-white"
      } ${collapsed ? "justify-center px-2" : ""}`}
    >
      <span
        className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-lg transition-colors ${
          active ? "bg-white/15 text-white" : "text-white/80 group-hover:bg-white/10 group-hover:text-white"
        }`}
      >
        <AdminNavIcon name={link.icon} />
      </span>
      {!collapsed && <span className="truncate">{link.label}</span>}
    </Link>
  );
}
