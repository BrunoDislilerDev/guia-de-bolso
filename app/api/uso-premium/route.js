import { NextResponse } from "next/server";
import { getAuthUser, getPerfilUsage } from "@/lib/premiumServer";
import { reportError } from "@/lib/observability";
import { buildApiErrorBody } from "@/lib/userMessages";

/**
 * Returns premium feature usage counters for the current session user.
 * @returns {Promise<import("next/server").NextResponse>} `{ loggedIn, usage }` payload.
 */
export async function GET() {
  try {
    const { user } = await getAuthUser();

    if (!user) {
      return NextResponse.json({
        loggedIn: false,
        usage: null,
      });
    }

    const usage = await getPerfilUsage(user.id);

    return NextResponse.json({
      loggedIn: true,
      usage,
    });
  } catch (err) {
    reportError(err, { route: "GET /api/uso-premium" });
    const { user } = await getAuthUser().catch(() => ({ user: null }));
    return NextResponse.json(
      {
        loggedIn: Boolean(user?.id),
        usage: null,
        ...buildApiErrorBody("SERVER"),
      },
      { status: 500 }
    );
  }
}
