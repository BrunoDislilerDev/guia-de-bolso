import LandingPageClient from "@/components/landing/LandingPageClient";
import { buildLandingMetadata } from "@/lib/seo";

export const metadata = buildLandingMetadata();

/**
 * Landing marketing — estabelecimentos e usuários.
 * @returns {import('react').ReactElement}
 */
export default function LandingPage() {
  return <LandingPageClient />;
}
