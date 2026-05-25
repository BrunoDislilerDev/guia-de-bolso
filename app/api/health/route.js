import { NextResponse } from "next/server";

/**
 * GET /api/health — smoke de deploy e uptime.
 */
export async function GET() {
  return NextResponse.json({
    ok: true,
    service: "guia-de-bolso",
    timestamp: new Date().toISOString(),
  });
}
