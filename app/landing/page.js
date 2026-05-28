import LandingPageClient from "@/components/landing/LandingPageClient";
import { fetchLandingPageData } from "@/lib/landingPageData";
import { buildLandingMetadata } from "@/lib/seo";

export const metadata = buildLandingMetadata();

/**
 * Landing marketing — SSR com lugares e categorias reais.
 * @returns {Promise<import('react').ReactElement>}
 */
export default async function LandingPage() {
  const initialData = await fetchLandingPageData();

  return <LandingPageClient initialData={initialData} />;
}
