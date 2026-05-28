/**
 * Layout da landing — scroll suave, fundo premium.
 * @param {{ children: import('react').ReactNode }} props
 * @returns {import('react').ReactElement}
 */
export default function LandingLayout({ children }) {
  return <div className="scroll-smooth antialiased [font-feature-settings:'kern'_1,'liga'_1]">{children}</div>;
}
