"use client";

import { AnimatePresence, motion, useScroll, useMotionValueEvent } from "framer-motion";
import Link from "next/link";
import { useEffect, useState } from "react";
import LandingButton from "@/components/landing/LandingButton";
import { IconClose, IconMenu } from "@/components/landing/LandingIcons";
import Logo from "@/components/Logo";
import { LANDING_NAV_LINKS, landingContactMailto } from "@/lib/landingContent";

/**
 * Navbar fixa da landing — transparente no hero, sólida ao rolar.
 * @returns {import('react').ReactElement}
 */
export default function LandingNavbar() {
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const { scrollY } = useScroll();

  useMotionValueEvent(scrollY, "change", (y) => {
    setScrolled(y > 48);
  });

  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [open]);

  const navClass = scrolled
    ? "border-b border-[#1a4a3a]/10 bg-[#f0f4f3]/95 shadow-sm backdrop-blur-lg"
    : "bg-transparent";

  const linkClass = scrolled
    ? "text-[#1a2e28]/80 hover:text-[#1a4a3a]"
    : "text-white/85 hover:text-white";

  return (
    <header className={`fixed inset-x-0 top-0 z-50 transition-colors duration-300 ${navClass}`}>
      <nav
        className="mx-auto flex max-w-6xl items-center justify-between gap-4 px-4 py-4 sm:px-6 lg:px-8"
        aria-label="Principal"
      >
        <Link
          href="/"
          className="inline-flex items-center gap-2 rounded-lg focus-visible:outline-none"
          aria-label="Guia de Bolso — início"
        >
          <Logo size="sm" variant={scrolled ? "default" : "light"} showWordmark />
        </Link>

        <ul className="hidden items-center gap-8 md:flex" role="list">
          {LANDING_NAV_LINKS.map((link) => (
            <li key={link.href}>
              <a href={link.href} className={`text-sm font-medium transition-colors ${linkClass}`}>
                {link.label}
              </a>
            </li>
          ))}
        </ul>

        <div className="hidden md:block">
          <LandingButton
            href={landingContactMailto("Cadastro de estabelecimento")}
            variant={scrolled ? "primary" : "mint"}
            external
          >
            Cadastrar Estabelecimento
          </LandingButton>
        </div>

        <button
          type="button"
          className={`inline-flex rounded-lg p-2 md:hidden ${scrolled ? "text-[#1a4a3a]" : "text-white"}`}
          aria-expanded={open}
          aria-controls="landing-mobile-menu"
          aria-label={open ? "Fechar menu" : "Abrir menu"}
          onClick={() => setOpen((v) => !v)}
        >
          {open ? <IconClose className="h-6 w-6" /> : <IconMenu className="h-6 w-6" />}
        </button>
      </nav>

      <AnimatePresence>
        {open ? (
          <motion.div
            id="landing-mobile-menu"
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="overflow-hidden border-t border-[#1a4a3a]/10 bg-[#f0f4f3] md:hidden"
          >
            <ul className="flex flex-col gap-1 px-4 py-4" role="list">
              {LANDING_NAV_LINKS.map((link) => (
                <li key={link.href}>
                  <a
                    href={link.href}
                    className="block rounded-lg px-3 py-3 text-base font-medium text-[#1a2e28]"
                    onClick={() => setOpen(false)}
                  >
                    {link.label}
                  </a>
                </li>
              ))}
              <li className="pt-2">
                <LandingButton
                  href={landingContactMailto("Cadastro de estabelecimento")}
                  variant="primary"
                  className="w-full"
                  external
                  onClick={() => setOpen(false)}
                >
                  Cadastrar Estabelecimento
                </LandingButton>
              </li>
            </ul>
          </motion.div>
        ) : null}
      </AnimatePresence>
    </header>
  );
}
