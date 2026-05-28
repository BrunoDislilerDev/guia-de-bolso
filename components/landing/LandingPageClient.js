"use client";

import LandingAppShowcase from "@/components/landing/LandingAppShowcase";
import LandingBusinessBenefits from "@/components/landing/LandingBusinessBenefits";
import LandingDiscover from "@/components/landing/LandingDiscover";
import LandingFinalCta from "@/components/landing/LandingFinalCta";
import LandingFooter from "@/components/landing/LandingFooter";
import LandingHero from "@/components/landing/LandingHero";
import LandingHowItWorks from "@/components/landing/LandingHowItWorks";
import LandingNavbar from "@/components/landing/LandingNavbar";
import LandingPartners from "@/components/landing/LandingPartners";
import LandingTestimonials from "@/components/landing/LandingTestimonials";
import LandingTouristBenefits from "@/components/landing/LandingTouristBenefits";
import { getLandingFallbackData } from "@/lib/landingPageData";

/**
 * Landing premium — SSR + Framer Motion.
 * @param {object} props
 * @param {import('@/lib/landingPageData').LandingPageData} [props.initialData]
 * @returns {import('react').ReactElement}
 */
export default function LandingPageClient({ initialData }) {
  const data = initialData ?? getLandingFallbackData();

  return (
    <div className="min-h-screen bg-[#fafaf9] text-[#0d1f19] selection:bg-[#7fd4ae]/30">
      <LandingNavbar />
      <main id="conteudo-principal">
        <LandingHero
          stats={data.stats}
          hasLiveData={data.hasLiveData}
          showcase={data.showcase}
          parceiros={data.parceiros}
          categorias={data.categorias}
        />
        <LandingHowItWorks />
        <LandingDiscover
          showcase={data.showcase}
          categorias={data.categorias}
          hasLiveData={data.hasLiveData}
        />
        <LandingTouristBenefits />
        <LandingBusinessBenefits />
        <LandingAppShowcase rotas={data.rotas} />
        <LandingPartners parceiros={data.parceiros} />
        <LandingTestimonials />
        <LandingFinalCta />
      </main>
      <LandingFooter />
    </div>
  );
}
