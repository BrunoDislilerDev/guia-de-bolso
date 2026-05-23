import { NextResponse } from "next/server";
import { createDefaultUsage } from "@/lib/premium";
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

    let usage;
    try {
      usage = await getPerfilUsage(user.id);
    } catch (perfilErr) {
      console.error("GET /api/uso-premium perfil:", perfilErr);
      usage = createDefaultUsage();
    }

    return NextResponse.json({
      loggedIn: true,
      usage,
    });
  } catch (err) {
    console.error("GET /api/uso-premium:", err);
    const { user } = await getAuthUser().catch(() => ({ user: null }));
    if (user?.id) {
      return NextResponse.json({
        loggedIn: true,
        usage: createDefaultUsage(),
        ...buildApiErrorBody("SERVER"),
      });
    }
    return NextResponse.json(
      { loggedIn: false, usage: null, ...buildApiErrorBody("SERVER") },
      { status: 500 }
    );
  }
}
