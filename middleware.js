import { createServerClient } from "@supabase/ssr";
import { NextResponse } from "next/server";
import {
  getMarketingRouteAction,
  getRequestHostname,
  isMarketingHost,
} from "@/lib/marketingHost";

/**
 * Middleware: domínio de marketing (guiadebolso.app) só landing + legal; demais hosts = app completo.
 * @param {import("next/server").NextRequest} request - Incoming request.
 * @returns {Promise<import("next/server").NextResponse>} Response with updated session cookies.
 */
export async function middleware(request) {
  const host = getRequestHostname(request);

  if (isMarketingHost(host)) {
    const action = getMarketingRouteAction(request.nextUrl.pathname);

    if (action === "redirect-root") {
      return NextResponse.redirect(new URL("/", request.url), 308);
    }
    if (action === "rewrite-landing") {
      return NextResponse.rewrite(new URL("/landing", request.url));
    }
    if (action === "redirect-home") {
      return NextResponse.redirect(new URL("/", request.url), 307);
    }
    return NextResponse.next();
  }

  let supabaseResponse = NextResponse.next({ request });

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll();
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value }) => {
            request.cookies.set(name, value);
          });
          supabaseResponse = NextResponse.next({ request });
          cookiesToSet.forEach(({ name, value, options }) => {
            supabaseResponse.cookies.set(name, value, options);
          });
        },
      },
    }
  );

  await supabase.auth.getUser();

  return supabaseResponse;
}

export const config = {
  matcher: [
    "/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)",
  ],
};
