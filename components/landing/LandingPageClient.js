"use client";

import LandingBusinesses from "@/components/landing/LandingBusinesses";
import LandingDiscover from "@/components/landing/LandingDiscover";
import LandingFeatures from "@/components/landing/LandingFeatures";
import LandingFinalCta from "@/components/landing/LandingFinalCta";
import LandingFooter from "@/components/landing/LandingFooter";
import LandingHero from "@/components/landing/LandingHero";
import LandingHowItWorks from "@/components/landing/LandingHowItWorks";
import LandingNavbar from "@/components/landing/LandingNavbar";
import LandingPartners from "@/components/landing/LandingPartners";
import { getLandingFallbackData } from "@/lib/landingPageData";

/**
 * Landing marketing — dados reais do Supabase + UI verde animada.
 * @param {object} props
 * @param {import('@/lib/landingPageData').LandingPageData} [props.initialData]
 * @returns {import('react').ReactElement}
 */
export default function LandingPageClient({ initialData }) {
  const data = initialData ?? getLandingFallbackData();

  return (
    <div className="min-h-screen bg-[#f0f4f3] text-[#1a2e28]">
      <LandingNavbar />
      <main id="conteudo-principal">
        <LandingHero stats={data.stats} hasLiveData={data.hasLiveData} />
        <LandingDiscover
          showcase={data.showcase}
          categorias={data.categorias}
          rotas={data.rotas}
          hasLiveData={data.hasLiveData}
        />
        <LandingPartners parceiros={data.parceiros} />
        <LandingFeatures />
        <LandingBusinesses />
        <LandingHowItWorks />
        <LandingFinalCta />
      </main>
      <LandingFooter />
    </div>
  );
}
