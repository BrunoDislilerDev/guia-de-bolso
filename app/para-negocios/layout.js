import "@/components/landing/landing.css";

/**
 * Layout B2B — mesmos tokens visuais da landing principal.
 * @param {{ children: import('react').ReactNode }} props
 * @returns {import('react').ReactElement}
 */
export default function ParaNegociosLayout({ children }) {
  return (
    <div className="landing-root landing-motion-lite scroll-smooth antialiased [font-feature-settings:'kern'_1,'liga'_1,'cv01'_1]">
      {children}
    </div>
  );
}
