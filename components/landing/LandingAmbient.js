/**
 * Camadas de luz e blur orgânico para seções cinematográficas.
 * @param {object} props
 * @param {"hero"|"section"|"dark"} [props.variant]
 * @param {string} [props.className]
 * @returns {import('react').ReactElement}
 */
export default function LandingAmbient({ variant = "section", className = "" }) {
  if (variant === "hero") {
    return (
      <div className={`pointer-events-none absolute inset-0 overflow-hidden ${className}`} aria-hidden>
        <div className="absolute inset-0 landing-hero-mesh" />
        <div className="landing-ambient-drift absolute -left-[30%] top-[-20%] h-[85%] w-[75%] rounded-full bg-[#7fd4ae]/20 blur-[120px]" />
        <div className="landing-ambient-drift-slow absolute -right-[15%] top-[10%] h-[60%] w-[55%] rounded-full bg-[#1a4a3a]/10 blur-[100px]" />
        <div className="landing-ambient-drift absolute bottom-[-10%] left-[20%] h-[45%] w-[60%] rounded-full bg-[#7fd4ae]/10 blur-[90px]" />
        <div className="landing-noise absolute inset-0" />
      </div>
    );
  }

  if (variant === "dark") {
    return (
      <div className={`pointer-events-none absolute inset-0 overflow-hidden ${className}`} aria-hidden>
        <div className="absolute inset-0 bg-[#0f2e24]" />
        <div className="absolute -right-[20%] top-0 h-full w-[60%] bg-[radial-gradient(ellipse_at_center,rgba(127,212,174,0.15),transparent_65%)]" />
      </div>
    );
  }

  return (
    <div className={`pointer-events-none absolute inset-0 overflow-hidden ${className}`} aria-hidden>
      <div className="absolute inset-0 landing-section-fade opacity-80" />
      <div className="absolute left-1/2 top-0 h-px w-[min(100%,48rem)] -translate-x-1/2 bg-gradient-to-r from-transparent via-[#1a4a3a]/10 to-transparent" />
    </div>
  );
}
