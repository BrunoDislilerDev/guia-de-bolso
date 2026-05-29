import { NextResponse } from "next/server";
import { purgeLugaresInativos } from "@/lib/purgeLugaresInativos";
import { createServiceClient } from "@/lib/supabase/service";
import { verifyCronSecret } from "@/lib/verifyCronSecret";

export const dynamic = "force-dynamic";
export const maxDuration = 60;

/**
 * Cron diário: exclui lugares com status desativado há 30+ dias.
 * Auth: CRON_SECRET (Bearer ou header x-cron-secret).
 * Query: ?dryRun=1 para simular sem deletar.
 */
export async function GET(request) {
  if (!verifyCronSecret(request)) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const admin = createServiceClient();
  if (!admin) {
    return NextResponse.json(
      { error: "SUPABASE_SERVICE_ROLE_KEY ausente" },
      { status: 503 }
    );
  }

  const dryRun =
    request.nextUrl.searchParams.get("dryRun") === "1" ||
    request.nextUrl.searchParams.get("dry_run") === "1";

  try {
    const result = await purgeLugaresInativos(admin, { dryRun });
    return NextResponse.json({ ok: true, ...result });
  } catch (err) {
    console.error("[cron/lugares-purge]", err);
    return NextResponse.json(
      {
        ok: false,
        error: err instanceof Error ? err.message : "Erro ao purgar lugares",
      },
      { status: 500 }
    );
  }
}
