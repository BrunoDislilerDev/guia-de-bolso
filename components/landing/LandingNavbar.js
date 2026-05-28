"use client";

import { AnimatePresence, motion, useScroll, useMotionValueEvent } from "framer-motion";
import Link from "next/link";
import { useEffect, useState } from "react";
import LandingButton from "@/components/landing/LandingButton";
import { IconClose, IconMenu } from "@/components/landing/LandingIcons";
import Logo from "@/components/Logo";
import { LANDING_NAV_LINKS, landingContactMailto } from "@/lib/landingContent";

/**
 * Navbar minimalista — glass ao rolar.
 * @returns {import('react').ReactElement}
 */
export default function LandingNavbar() {
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const { scrollY } = useScroll();

  useMotionValueEvent(scrollY, "change", (y) => setScrolled(y > 24));

  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [open]);

  return (
    <header
      className={`fixed inset-x-0 top-0 z-50 transition-all duration-500 ${
        scrolled
          ? "border-b border-[rgba(13,31,25,0.06)] bg-[#fafaf9]/80 shadow-[0_1px_0_rgba(255,255,255,0.8)_inset] backdrop-blur-xl"
          : "bg-transparent"
      }`}
    >
      <nav
        className="mx-auto flex h-16 max-w-6xl items-center justify-between px-5 sm:h-[4.25rem] sm:px-8 lg:px-10"
        aria-label="Principal"
      >
        <Link href="/" className="rounded-lg focus-visible:outline-none" aria-label="Guia de Bolso">
          <Logo size="sm" showWordmark />
        </Link>

        <ul className="hidden items-center gap-10 md:flex" role="list">
          {LANDING_NAV_LINKS.map((link) => (
            <li key={link.href}>
              <a
                href={link.href}
                className="text-[13px] font-medium text-[#5c6f68] transition-colors hover:text-[#0d1f19]"
              >
                {link.label}
              </a>
            </li>
          ))}
        </ul>

        <div className="hidden md:block">
          <LandingButton
            href={landingContactMailto("Cadastro")}
            variant="primary"
            size="md"
            external
          >
            Cadastrar negócio
          </LandingButton>
        </div>

        <button
          type="button"
          className="rounded-full p-2.5 text-[#0d1f19] md:hidden"
          aria-expanded={open}
          aria-controls="landing-mobile-menu"
          aria-label={open ? "Fechar menu" : "Abrir menu"}
          onClick={() => setOpen((v) => !v)}
        >
          {open ? <IconClose className="h-5 w-5" /> : <IconMenu className="h-5 w-5" />}
        </button>
      </nav>

      <AnimatePresence>
        {open ? (
          <motion.div
            id="landing-mobile-menu"
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="overflow-hidden border-t border-[#1a4a3a]/8 bg-[#fafaf9]/95 backdrop-blur-xl md:hidden"
          >
            <ul className="flex flex-col gap-1 px-5 py-5" role="list">
              {LANDING_NAV_LINKS.map((link) => (
                <li key={link.href}>
                  <a
                    href={link.href}
                    className="block rounded-2xl px-4 py-3.5 text-base font-medium text-[#0d1f19]"
                    onClick={() => setOpen(false)}
                  >
                    {link.label}
                  </a>
                </li>
              ))}
              <li className="pt-3">
                <LandingButton
                  href={landingContactMailto("Cadastro")}
                  variant="primary"
                  className="w-full"
                  external
                  onClick={() => setOpen(false)}
                >
                  Cadastrar meu negócio
                </LandingButton>
              </li>
            </ul>
          </motion.div>
        ) : null}
      </AnimatePresence>
    </header>
  );
}
