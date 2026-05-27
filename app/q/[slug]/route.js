import { NextResponse } from "next/server";
import { isLugarElegivelQr } from "@/lib/lugarQr";
import { getLugarPublicPath } from "@/lib/lugarPublicPath";
import { getSiteUrl } from "@/lib/siteUrl";
import { supabase } from "@/lib/supabase/anon";
import { createServiceClient } from "@/lib/supabase/service";

/**
 * Redirect curto /q/{slug} → detalhe do lugar + log de scan.
 * @param {import("next/server").NextRequest} request
 * @param {{ params: Promise<{ slug: string }> }} context
 * @returns {Promise<import("next/server").NextResponse>}
 */
export async function GET(request, { params }) {
  const { slug: rawSlug } = await params;
  const slug = String(rawSlug || "")
    .trim()
    .toLowerCase();

  if (!slug) {
    return new NextResponse("Not found", { status: 404 });
  }

  const { data: lugar, error } = await supabase
    .from("lugares")
    .select("id, nome, categoria, slug, status")
    .eq("slug", slug)
    .eq("status", "ativo")
    .maybeSingle();

  if (error) {
    console.error("GET /q/[slug] lookup:", error.message);
    return new NextResponse("Not found", { status: 404 });
  }

  if (!lugar || !isLugarElegivelQr(lugar)) {
    return new NextResponse("Not found", { status: 404 });
  }

  const service = createServiceClient();
  if (service) {
    const { error: logError } = await service.from("logs").insert({
      user_id: null,
      user_email: null,
      user_nome: null,
      acao: "escaneou_qr",
      detalhes: {
        lugar_id: lugar.id,
        lugar_nome: lugar.nome,
        slug,
        pagina: `/q/${slug}`,
      },
    });

    if (logError) {
      console.error("GET /q/[slug] log:", logError.message);
    }
  } else {
    console.warn("SUPABASE_SERVICE_ROLE_KEY ausente — scan QR não registrado");
  }

  const origin = getSiteUrl(request.nextUrl.origin);
  const redirectUrl = new URL(getLugarPublicPath(lugar), origin);
  redirectUrl.searchParams.set("ref", "qr");

  return NextResponse.redirect(redirectUrl, { status: 301 });
}
