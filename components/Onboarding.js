"use client";

import { useState } from "react";

/**
 * IconPin - Map pin icon for onboarding slide.
 * @param {object} props
 * @param {string} [props.className]
 * @returns {import('react').ReactElement}
 */
function IconPin({ className = "h-7 w-7" }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="currentColor" aria-hidden>
      <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5a2.5 2.5 0 110-5 2.5 2.5 0 010 5z" />
    </svg>
  );
}

/**
 * IconTimer - Timer icon for onboarding slide.
 * @param {object} props
 * @param {string} [props.className]
 * @returns {import('react').ReactElement}
 */
function IconTimer({ className = "h-7 w-7" }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="currentColor" aria-hidden>
      <path d="M15 1H9v2h6V1zm-4 13h2V8h-2v6zm1-10C7.03 4 3 8.03 3 13s4.02 9 9 9 9-4.03 9-9-4.03-9-9-9zm0 16a7 7 0 110-14 7 7 0 010 14z" />
    </svg>
  );
}

/**
 * IconHeart - Heart icon for onboarding slide.
 * @param {object} props
 * @param {string} [props.className]
 * @returns {import('react').ReactElement}
 */
function IconHeart({ className = "h-7 w-7" }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="currentColor" aria-hidden>
      <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" />
    </svg>
  );
}

/**
 * IconWaves - Waves icon for feature chip.
 * @param {object} props
 * @param {string} [props.className]
 * @returns {import('react').ReactElement}
 */
function IconWaves({ className = "h-6 w-6" }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="currentColor" aria-hidden>
      <path d="M2 16c2 0 2.75-1.2 4.5-1.2S9 16 11 16s2.75-1.2 4.5-1.2S18 16 20 16h2v2h-2c-2 0-2.75-1.2-4.5-1.2S13 18 11 18s-2.75-1.2-4.5-1.2S4 18 2 18v-2zm0-5c2 0 2.75-1.2 4.5-1.2S9 11 11 11s2.75-1.2 4.5-1.2S18 11 20 11h2v2h-2c-2 0-2.75-1.2-4.5-1.2S13 13 11 13s-2.75-1.2-4.5-1.2S4 13 2 13v-2z" />
    </svg>
  );
}

/**
 * IconMountain - Mountain icon for feature chip.
 * @param {object} props
 * @param {string} [props.className]
 * @returns {import('react').ReactElement}
 */
function IconMountain({ className = "h-6 w-6" }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="currentColor" aria-hidden>
      <path d="M14 6l-3.75 5 2.85 3.8L11.5 16.1 7 10l-6 8h22L14 6z" />
    </svg>
  );
}

/**
 * IconUtensils - Utensils icon for feature chip.
 * @param {object} props
 * @param {string} [props.className]
 * @returns {import('react').ReactElement}
 */
function IconUtensils({ className = "h-6 w-6" }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="currentColor" aria-hidden>
      <path d="M8.1 13.34l2.83-2.83L3.91 3.5a4.008 4.008 0 000 5.66l4.19 4.18zm6.78-1.81c1.53.71 3.68.21 5.27-1.38 1.91-1.91 2.28-4.65.81-6.12-1.46-1.46-4.2-1.1-6.12.81-1.59 1.59-2.09 3.74-1.38 5.27L3.7 19.87l1.41 1.41L12 14.41l6.88 6.88 1.41-1.41L13.41 13l1.47-1.47z" />
    </svg>
  );
}

/**
 * IconStar - Star icon for feature chip.
 * @param {object} props
 * @param {string} [props.className]
 * @returns {import('react').ReactElement}
 */
function IconStar({ className = "h-6 w-6" }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="currentColor" aria-hidden>
      <path d="M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21 12 17.27z" />
    </svg>
  );
}

/**
 * IconMap - Map icon for feature chip.
 * @param {object} props
 * @param {string} [props.className]
 * @returns {import('react').ReactElement}
 */
function IconMap({ className = "h-6 w-6" }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="currentColor" aria-hidden>
      <path d="M20.5 3l-.16.03L15 5.1 9 3 3.36 4.9A.5.5 0 003 5.38V21l6-2.1 6 2.1 5.64-1.9a.5.5 0 00.36-.48V3.5a.5.5 0 00-.5-.5zM10 5.47l4 1.4v11.66l-4-1.4V5.47zm-5 1.1l3-1.01v11.58l-3 1.05V6.57zm14 10.86l-3 1.01V6.86l3-1.16v11.73z" />
    </svg>
  );
}

/**
 * IconCamera - Camera icon for feature chip.
 * @param {object} props
 * @param {string} [props.className]
 * @returns {import('react').ReactElement}
 */
function IconCamera({ className = "h-6 w-6" }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="currentColor" aria-hidden>
      <path d="M20 5h-3.17l-1.84-2H9.01L7.17 5H4c-1.1 0-2 .9-2 2v12c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V7c0-1.1-.9-2-2-2zm-8 13a5 5 0 110-10 5 5 0 010 10zm0-1.8a3.2 3.2 0 100-6.4 3.2 3.2 0 000 6.4z" />
    </svg>
  );
}

/**
 * IconSunset - Sunset icon for feature chip.
 * @param {object} props
 * @param {string} [props.className]
 * @returns {import('react').ReactElement}
 */
function IconSunset({ className = "h-6 w-6" }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="currentColor" aria-hidden>
      <path d="M3 19h18v2H3v-2zm16-4h3v2h-3v-2zM2 15h3v2H2v-2zm3.64-7.78l1.41-1.41 2.12 2.12-1.41 1.41-2.12-2.12zM11 3h2v4h-2V3zm5.83 4.93l2.12-2.12 1.41 1.41-2.12 2.12-1.41-1.41zM7 15a5 5 0 1110 0h-2a3 3 0 00-6 0H7z" />
    </svg>
  );
}

/**
 * IconCup - Cup icon for feature chip.
 * @param {object} props
 * @param {string} [props.className]
 * @returns {import('react').ReactElement}
 */
function IconCup({ className = "h-6 w-6" }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="currentColor" aria-hidden>
      <path d="M2 19h18v2H2v-2zM18 8h1a3 3 0 010 6h-1.18A6.99 6.99 0 015 10V5h13v3zm0 2v2h1a1 1 0 000-2h-1zM7 7v3a5 5 0 0010 0V7H7z" />
    </svg>
  );
}

const slides = [
  {
    Icon: IconPin,
    title: "Descubra lugares incríveis",
    subtitle: "Guia locais, praias, cafés e experiências em um só lugar.",
    features: [
      { Icon: IconWaves, label: "Praias" },
      { Icon: IconMountain, label: "Trilhas" },
      { Icon: IconUtensils, label: "Gastronomia" },
    ],
  },
  {
    Icon: IconTimer,
    title: "Tudo organizado para você",
    subtitle: "Encontre rapidamente o que fazer sem perder tempo procurando.",
    features: [
      { Icon: IconStar, label: "Lugares recomendados" },
      { Icon: IconMap, label: "Rotas simples" },
      { Icon: IconCamera, label: "Dicas locais" },
    ],
  },
  {
    Icon: IconHeart,
    title: "Explore como um local",
    subtitle: "Descubra cantinhos escondidos e experiências autênticas.",
    features: [
      { Icon: IconSunset, label: "Pôr do sol" },
      { Icon: IconWaves, label: "Surfe" },
      { Icon: IconCup, label: "Cafés" },
    ],
  },
];

/**
 * Onboarding - Multi-slide first-run introduction with skip and completion.
 * @param {object} props
 * @param {() => void} [props.onComplete] - Called after the user finishes or skips onboarding.
 * @returns {import('react').ReactElement}
 */
export default function Onboarding({ onComplete }) {
  const [currentSlide, setCurrentSlide] = useState(0);
  const slide = slides[currentSlide];
  const isLastSlide = currentSlide === slides.length - 1;

  /**
   * Persists onboarding completion in localStorage and invokes the parent callback.
   * @returns {void}
   */
  function completeOnboarding() {
    localStorage.setItem("onboarding_visto", "true");
    onComplete?.();
  }

  /**
   * Advances to the next slide or completes onboarding on the last slide.
   * @returns {void}
   */
  function handlePrimaryAction() {
    if (isLastSlide) {
      completeOnboarding();
      return;
    }

    setCurrentSlide((current) => current + 1);
  }

  return (
    <section className="fixed inset-0 z-50 overflow-hidden bg-[#f0f4f3] text-[#1a2e28]">
      <style>{`
        @keyframes onboardingSlide {
          from {
            opacity: 0;
            transform: translateX(16px);
          }
          to {
            opacity: 1;
            transform: translateX(0);
          }
        }
      `}</style>
      <div className="relative mx-auto min-h-screen max-w-md bg-[#f0f4f3]">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src="https://picsum.photos/seed/praia/400/600"
          alt="Praia em Garopaba e Imbituba"
          className="h-[60vh] w-full object-cover"
        />

        <div className="absolute inset-x-0 bottom-0 min-h-[48vh] rounded-t-[2rem] bg-white px-6 pb-8 pt-16 shadow-[0_-12px_35px_rgba(26,74,58,0.12)]">
          <div className="absolute left-1/2 top-0 flex h-20 w-20 -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full bg-[#d4ede8] text-[#1a4a3a] shadow-lg ring-8 ring-white">
            <slide.Icon />
          </div>

          <div
            key={currentSlide}
            className="transition-all duration-300 ease-out"
            style={{ animation: "onboardingSlide 300ms ease-out" }}
          >
            <h1 className="text-center text-2xl font-bold leading-tight text-[#1a4a3a]">
              {slide.title}
            </h1>
            <p className="mx-auto mt-3 max-w-xs text-center text-sm leading-relaxed text-[#5a6b66]">
              {slide.subtitle}
            </p>

            <div className="mt-7 grid grid-cols-3 gap-3">
              {slide.features.map(({ Icon, label }) => (
                <div key={label} className="flex flex-col items-center gap-2 text-center">
                  <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-[#f0f4f3] text-[#1a4a3a]">
                    <Icon />
                  </div>
                  <span className="text-xs font-medium leading-tight text-[#5a6b66]">
                    {label}
                  </span>
                </div>
              ))}
            </div>
          </div>

          <div className="mt-8 flex justify-center gap-2">
            {slides.map((_, index) => (
              <span
                key={index}
                className={`h-2 rounded-full transition-all duration-300 ${
                  index === currentSlide ? "w-7 bg-[#1a4a3a]" : "w-2 bg-[#d4ede8]"
                }`}
              />
            ))}
          </div>

          <button
            type="button"
            onClick={handlePrimaryAction}
            className="mt-7 w-full rounded-xl bg-[#1a4a3a] py-3.5 text-sm font-semibold text-white transition-colors hover:bg-[#153d30] active:bg-[#123528]"
          >
            {isLastSlide ? "Começar" : "Continuar"}
          </button>

          {currentSlide > 0 && (
            <button
              type="button"
              onClick={completeOnboarding}
              className="mt-4 w-full text-center text-sm font-medium text-[#5a6b66] transition-colors hover:text-[#1a4a3a]"
            >
              Pular introdução
            </button>
          )}
        </div>
      </div>
    </section>
  );
}
