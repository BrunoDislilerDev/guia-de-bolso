/**
 * Ícones do site (favicon, aba do navegador, PWA, Apple Touch).
 * Fonte: public/logo.png — gerar app/icon.png e app/apple-icon.png via scripts/refresh-brand-icons.mjs
 */

/** @type {import('next').Metadata['icons']} */
export const SITE_ICONS = {
  icon: [
    { url: "/favicon-32.png", sizes: "32x32", type: "image/png" },
    { url: "/icon-192.png", sizes: "192x192", type: "image/png" },
    { url: "/logo.png", sizes: "512x512", type: "image/png" },
  ],
  apple: [{ url: "/apple-touch-icon.png", sizes: "180x180", type: "image/png" }],
  shortcut: "/favicon-32.png",
};

/** @type {import('next').Metadata['manifest']} */
export const SITE_MANIFEST = "/site.webmanifest";
