"use client";

import LandingBusinesses from "@/components/landing/LandingBusinesses";
import LandingFeatures from "@/components/landing/LandingFeatures";
import LandingFinalCta from "@/components/landing/LandingFinalCta";
import LandingFooter from "@/components/landing/LandingFooter";
import LandingHero from "@/components/landing/LandingHero";
import LandingHowItWorks from "@/components/landing/LandingHowItWorks";
import LandingNavbar from "@/components/landing/LandingNavbar";
import LandingUsers from "@/components/landing/LandingUsers";

/**
 * Landing page completa — standalone, sem dados do app.
 * @returns {import('react').ReactElement}
 */
export default function LandingPageClient() {
  return (
    <div className="min-h-screen bg-[#f8fbfa] text-[#1a2e28]">
      <LandingNavbar />
      <main id="conteudo-principal">
        <LandingHero />
        <LandingFeatures />
        <LandingBusinesses />
        <LandingUsers />
        <LandingHowItWorks />
        <LandingFinalCta />
      </main>
      <LandingFooter />
    </div>
  );
}
