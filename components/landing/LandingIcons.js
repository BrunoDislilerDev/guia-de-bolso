/**
 * Ícones SVG inline — sem dependências externas.
 * @param {object} props
 * @param {string} [props.className]
 * @returns {import('react').ReactElement}
 */
function IconBase({ className = "h-6 w-6", children }) {
  return (
    <svg
      className={className}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.75"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      {children}
    </svg>
  );
}

/** @param {{ className?: string }} props */
export function IconMapPin({ className }) {
  return (
    <IconBase className={className}>
      <path d="M12 21s7-4.5 7-11a7 7 0 1 0-14 0c0 6.5 7 11 7 11z" />
      <circle cx="12" cy="10" r="2.5" />
    </IconBase>
  );
}

/** @param {{ className?: string }} props */
export function IconGrid({ className }) {
  return (
    <IconBase className={className}>
      <rect x="3" y="3" width="7" height="7" rx="1.5" />
      <rect x="14" y="3" width="7" height="7" rx="1.5" />
      <rect x="3" y="14" width="7" height="7" rx="1.5" />
      <rect x="14" y="14" width="7" height="7" rx="1.5" />
    </IconBase>
  );
}

/** @param {{ className?: string }} props */
export function IconClock({ className }) {
  return (
    <IconBase className={className}>
      <circle cx="12" cy="12" r="9" />
      <path d="M12 7v5l3 2" />
    </IconBase>
  );
}

/** @param {{ className?: string }} props */
export function IconStar({ className }) {
  return (
    <IconBase className={className}>
      <path d="M12 3l2.4 5.8 6.3.5-4.8 4.1 1.5 6.1L12 16.9 6.6 19.5l1.5-6.1-4.8-4.1 6.3-.5L12 3z" />
    </IconBase>
  );
}

/** @param {{ className?: string }} props */
export function IconLogin({ className }) {
  return (
    <IconBase className={className}>
      <path d="M15 3h4a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2h-4" />
      <path d="M10 17l5-5-5-5" />
      <path d="M15 12H3" />
    </IconBase>
  );
}

/** @param {{ className?: string }} props */
export function IconHeart({ className }) {
  return (
    <IconBase className={className}>
      <path d="M12 20s-6.5-4.2-8.5-8.2C1.8 8.5 4.2 5 7.5 5c1.8 0 3.2 1 4.5 2.6C13.3 6 14.7 5 16.5 5 19.8 5 22.2 8.5 20.5 11.8 18.5 15.8 12 20 12 20z" />
    </IconBase>
  );
}

/** @param {{ className?: string }} props */
export function IconStore({ className }) {
  return (
    <IconBase className={className}>
      <path d="M3 9l2-4h14l2 4" />
      <path d="M5 9v11h14V9" />
      <path d="M9 20v-6h6v6" />
    </IconBase>
  );
}

/** @param {{ className?: string }} props */
export function IconCompass({ className }) {
  return (
    <IconBase className={className}>
      <circle cx="12" cy="12" r="9" />
      <path d="M14.5 9.5L10 14l-2.5-2.5L12 10l2.5-2.5z" fill="currentColor" stroke="none" />
    </IconBase>
  );
}

/** @param {{ className?: string }} props */
export function IconMenu({ className }) {
  return (
    <IconBase className={className}>
      <path d="M4 7h16M4 12h16M4 17h16" />
    </IconBase>
  );
}

/** @param {{ className?: string }} props */
export function IconClose({ className }) {
  return (
    <IconBase className={className}>
      <path d="M6 6l12 12M18 6L6 18" />
    </IconBase>
  );
}

/** @param {{ className?: string }} props */
export function IconInstagram({ className }) {
  return (
    <IconBase className={className}>
      <rect x="3" y="3" width="18" height="18" rx="5" />
      <circle cx="12" cy="12" r="4" />
      <circle cx="17.5" cy="6.5" r="1" fill="currentColor" stroke="none" />
    </IconBase>
  );
}

/** @param {{ className?: string }} props */
export function IconTikTok({ className }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
      <path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-2.88 2.5 2.89 2.89 0 0 1-2.89-2.89 2.89 2.89 0 0 1 2.89-2.89c.28 0 .54.04.79.1V9.01a6.27 6.27 0 0 0-.79-.05 6.34 6.34 0 0 0-6.34 6.34 6.34 6.34 0 0 0 6.34 6.34 6.34 6.34 0 0 0 6.33-6.34V8.69a8.18 8.18 0 0 0 4.77 1.52V6.76a4.85 4.85 0 0 1-1-.07z" />
    </svg>
  );
}

/** @param {{ className?: string }} props */
export function IconMail({ className }) {
  return (
    <IconBase className={className}>
      <rect x="3" y="5" width="18" height="14" rx="2" />
      <path d="M3 7l9 6 9-6" />
    </IconBase>
  );
}

/** @type {Record<string, import('react').ComponentType<{ className?: string }>>} */
export const FEATURE_ICONS = {
  geo: IconMapPin,
  categorias: IconGrid,
  horario: IconClock,
  avaliacoes: IconStar,
  login: IconLogin,
  ux: IconHeart,
};
