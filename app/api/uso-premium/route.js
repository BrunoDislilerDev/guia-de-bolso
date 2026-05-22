import { NextResponse } from "next/server";
import { getAuthUser, getPerfilUsage } from "@/lib/premiumServer";
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
    console.error("GET /api/uso-premium:", err);
    return NextResponse.json(
      { loggedIn: false, usage: null, ...buildApiErrorBody("SERVER") },
      { status: 500 }
    );
  }
}
