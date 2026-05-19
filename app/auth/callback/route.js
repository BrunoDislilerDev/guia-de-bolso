import { createClient } from "@/lib/supabase/server";
import { registrarLog } from "@/lib/logs";
import { NextResponse } from "next/server";

/**
 * OAuth callback: exchanges the auth code for a session and redirects on success.
 * @param {import("next/server").NextRequest} request - Request with `code` and optional `next` query params.
 * @returns {Promise<import("next/server").NextResponse>} Redirect to app or login with error.
 */
export async function GET(request) {
  const { searchParams, origin } = new URL(request.url);
  const code = searchParams.get("code");
  const next = searchParams.get("next") ?? "/";

  if (code) {
    const supabase = await createClient();
    const { error } = await supabase.auth.exchangeCodeForSession(code);

    if (!error) {
      const {
        data: { user },
      } = await supabase.auth.getUser();
      await registrarLog(supabase, user, "login", {
        provider: user?.app_metadata?.provider,
      });
      return NextResponse.redirect(`${origin}${next}`);
    }
  }

  return NextResponse.redirect(`${origin}/login?error=auth`);
}
