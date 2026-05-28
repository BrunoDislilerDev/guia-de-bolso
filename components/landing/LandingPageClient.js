"use client";

import LandingAppShowcase from "@/components/landing/LandingAppShowcase";
import LandingBusinessBenefits from "@/components/landing/LandingBusinessBenefits";
import LandingDiscover from "@/components/landing/LandingDiscover";
import LandingFinalCta from "@/components/landing/LandingFinalCta";
import LandingFooter from "@/components/landing/LandingFooter";
import LandingHero from "@/components/landing/LandingHero";
import LandingHowItWorks from "@/components/landing/LandingHowItWorks";
import LandingMobileCta from "@/components/landing/LandingMobileCta";
import LandingNavbar from "@/components/landing/LandingNavbar";
import LandingPartners from "@/components/landing/LandingPartners";
import LandingTestimonials from "@/components/landing/LandingTestimonials";
import LandingTouristBenefits from "@/components/landing/LandingTouristBenefits";
import { getLandingFallbackData } from "@/lib/landingPageData";

/**
 * Landing premium — SSR, motion cinematográfico, dual audience.
 * @param {object} props
 * @param {import('@/lib/landingPageData').LandingPageData} [props.initialData]
 * @returns {import('react').ReactElement}
 */
export default function LandingPageClient({ initialData }) {
  const data = initialData ?? getLandingFallbackData();

  return (
    <>
      <LandingNavbar />
      <main id="conteudo-principal" className="pb-24 sm:pb-0">
        <LandingHero
          stats={data.stats}
          hasLiveData={data.hasLiveData}
          showcase={data.showcase}
          parceiros={data.parceiros}
          categorias={data.categorias}
          heroBackdrop={data.heroBackdrop}
        />
        <LandingDiscover
          discoverShowcase={data.discoverShowcase}
          categorias={data.categorias}
          hasLiveData={data.hasLiveData}
        />
        <LandingHowItWorks />
        <LandingTouristBenefits />
        <LandingAppShowcase categorias={data.categorias} stats={data.stats} />
        <LandingPartners parceiros={data.parceiros} />
        <LandingBusinessBenefits />
        <LandingTestimonials />
        <LandingFinalCta />
      </main>
      <LandingFooter />
      <LandingMobileCta />
    </>
  );
}
