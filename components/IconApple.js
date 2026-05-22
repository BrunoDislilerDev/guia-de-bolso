/**
 * Logotipo Apple para botão “Continuar com Apple”.
 * @param {{ className?: string, dark?: boolean }} props - `dark`: traço claro em fundo preto.
 * @returns {import("react").ReactElement}
 */
export default function IconApple({ className = "h-5 w-5", dark = false }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="currentColor" aria-hidden>
      <path
        fill={dark ? "#fff" : "currentColor"}
        d="M17.05 20.28c-.98.95-2.05 1.88-3.51 1.9-1.48.02-1.95-.87-3.63-.87-1.68 0-2.2.85-3.6.89-1.44.04-2.53-1.47-3.51-2.42C2.44 16.96 1.13 12.57 2.67 9.18c.77-1.72 2.17-2.81 3.68-2.83 1.45-.02 2.82.97 3.63.97.8 0 2.31-1.2 3.9-1.02.66.03 2.52.27 3.71 2.05-.09.06-2.22 1.29-2.2 3.84.03 3.05 2.68 4.07 2.72 4.09-.02.06-.43 1.47-1.26 2.92zM14.02 3.83c.8-.97 1.34-2.32 1.19-3.67-1.15.05-2.54.77-3.37 1.72-.74.85-1.39 2.22-1.22 3.53 1.29.1 2.61-.66 3.4-1.58z"
      />
    </svg>
  );
}
