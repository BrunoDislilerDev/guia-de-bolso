/**
 * Layout da landing — scroll suave entre âncoras.
 * @param {{ children: import('react').ReactNode }} props
 * @returns {import('react').ReactElement}
 */
export default function LandingLayout({ children }) {
  return <div className="scroll-smooth">{children}</div>;
}
