"use client";

import { AnimatePresence, motion, useMotionValueEvent, useScroll } from "framer-motion";
import Link from "next/link";
import { useEffect, useState } from "react";
import LandingButton from "@/components/landing/LandingButton";
import { IconClose, IconMenu } from "@/components/landing/LandingIcons";
import Logo from "@/components/Logo";
import {
  LANDING_HERO,
  LANDING_NAV_LINKS,
  LANDING_SECTION_IDS,
  landingContactMailto,
} from "@/lib/landingContent";

/**
 * Navbar premium — glass, dual CTA, motion suave.
 * @returns {import('react').ReactElement}
 */
export default function LandingNavbar() {
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const { scrollY } = useScroll();

  useMotionValueEvent(scrollY, "change", (y) => setScrolled(y > 16));

  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [open]);

  return (
    <header className="fixed inset-x-0 top-0 z-50">
      <div
        className={`transition-all duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] ${
          scrolled
            ? "landing-glass border-b border-[rgba(10,22,18,0.06)] py-0 shadow-[0_8px_32px_rgba(10,22,18,0.04)]"
            : "bg-transparent py-1"
        }`}
      >
        <nav
          className="mx-auto flex h-[3.75rem] max-w-[76rem] items-center justify-between gap-4 px-5 sm:h-16 sm:px-8 lg:px-12"
          aria-label="Principal"
        >
          <Link
            href="/"
            className="rounded-xl transition-opacity hover:opacity-80 focus-visible:outline-none"
            aria-label="Guia de Bolso"
          >
            <Logo size="sm" showWordmark />
          </Link>

          <ul className="hidden items-center gap-9 lg:flex" role="list">
            {LANDING_NAV_LINKS.map((link) => (
              <li key={link.href}>
                <a
                  href={link.href}
                  className="landing-link-underline text-[13px] font-medium text-[#4a5c56] transition-colors hover:text-[#0a1612]"
                >
                  {link.label}
                </a>
              </li>
            ))}
          </ul>

          <div className="hidden items-center gap-2.5 sm:flex">
            <LandingButton
              href={`#${LANDING_SECTION_IDS.categorias}`}
              variant="ghost"
              size="md"
            >
              {LANDING_HERO.ctaExplore}
            </LandingButton>
            <LandingButton
              href={landingContactMailto("Cadastro")}
              variant="primary"
              size="md"
              external
            >
              {LANDING_HERO.ctaBusiness}
            </LandingButton>
          </div>

          <button
            type="button"
            className="landing-glass rounded-full p-2.5 text-[#0a1612] sm:hidden"
            aria-expanded={open}
            aria-controls="landing-mobile-menu"
            aria-label={open ? "Fechar menu" : "Abrir menu"}
            onClick={() => setOpen((v) => !v)}
          >
            {open ? <IconClose className="h-5 w-5" /> : <IconMenu className="h-5 w-5" />}
          </button>
        </nav>
      </div>

      <AnimatePresence>
        {open ? (
          <motion.div
            id="landing-mobile-menu"
            initial={{ opacity: 0, y: -8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
            className="landing-glass border-t border-[rgba(10,22,18,0.06)] sm:hidden"
          >
            <ul className="flex flex-col gap-0.5 px-5 py-4" role="list">
              {LANDING_NAV_LINKS.map((link) => (
                <li key={link.href}>
                  <a
                    href={link.href}
                    className="block rounded-2xl px-4 py-3.5 text-[15px] font-medium text-[#0a1612] transition-colors hover:bg-[#1a4a3a]/5"
                    onClick={() => setOpen(false)}
                  >
                    {link.label}
                  </a>
                </li>
              ))}
              <li className="mt-3 grid gap-2 border-t border-[#1a4a3a]/8 pt-4">
                <LandingButton
                  href={`#${LANDING_SECTION_IDS.categorias}`}
                  variant="primary"
                  className="w-full"
                  onClick={() => setOpen(false)}
                >
                  {LANDING_HERO.ctaExplore}
                </LandingButton>
                <LandingButton
                  href={landingContactMailto("Cadastro")}
                  variant="secondary"
                  className="w-full"
                  external
                  onClick={() => setOpen(false)}
                >
                  {LANDING_HERO.ctaBusiness}
                </LandingButton>
              </li>
            </ul>
          </motion.div>
        ) : null}
      </AnimatePresence>
    </header>
  );
}
