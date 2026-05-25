import { NextResponse } from "next/server";
import { reportError } from "@/lib/observability";
import { getAuthUser } from "@/lib/premiumServer";
import { buildApiErrorBody } from "@/lib/userMessages";

/**
 * Deletes a saved AI itinerary owned by the authenticated user.
 * @param {import("next/server").NextRequest} _request
 * @param {{ params: Promise<{ id: string }> }} context
 * @returns {Promise<import("next/server").NextResponse>}
 */
export async function DELETE(_request, { params }) {
  try {
    const { id } = await params;

    if (!id?.trim()) {
      return NextResponse.json(buildApiErrorBody("VALIDATION"), { status: 400 });
    }

    const { user, supabase } = await getAuthUser();

    if (!user) {
      return NextResponse.json(
        {
          ...buildApiErrorBody("LOGIN_REQUIRED"),
          error: "Faça login para excluir o roteiro.",
        },
        { status: 401 }
      );
    }

    const { data, error } = await supabase
      .from("roteiros")
      .delete()
      .eq("id", id.trim())
      .eq("user_id", user.id)
      .select("id")
      .maybeSingle();

    if (error) {
      reportError(error, { route: "DELETE /api/roteiro/[id]" });
      return NextResponse.json(buildApiErrorBody("SERVER"), { status: 500 });
    }

    if (!data) {
      return NextResponse.json(
        {
          error:
            "Roteiro não encontrado ou sem permissão. Se o problema persistir, rode supabase/roteiros_policies.sql no Supabase.",
        },
        { status: 404 }
      );
    }

    return NextResponse.json({ success: true });
  } catch (err) {
    reportError(err, { route: "DELETE /api/roteiro/[id]" });
    return NextResponse.json(buildApiErrorBody("SERVER"), { status: 500 });
  }
}
