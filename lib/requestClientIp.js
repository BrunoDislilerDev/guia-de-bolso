/**
 * IP do cliente a partir de headers de proxy (Vercel/CDN).
 * @param {import("next/server").NextRequest} request
 * @returns {string}
 */
export function getRequestClientIp(request) {
  return (
    request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ||
    request.headers.get("x-real-ip") ||
    "unknown"
  );
}
