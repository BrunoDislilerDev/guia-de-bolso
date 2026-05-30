import NegociosPageClient from "@/components/negocios/NegociosPageClient";
import { fetchNegociosPageData } from "@/lib/negociosPageData";
import { buildParaNegociosMetadata } from "@/lib/seo";

export const metadata = buildParaNegociosMetadata();

/**
 * Página dedicada para anunciantes e estabelecimentos.
 * @returns {Promise<import('react').ReactElement>}
 */
export default async function ParaNegociosPage() {
  const initialData = await fetchNegociosPageData();

  return <NegociosPageClient initialData={initialData} />;
}
