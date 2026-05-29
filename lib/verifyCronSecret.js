/**
 * Valida chamada de cron (Vercel envia Authorization: Bearer <CRON_SECRET>).
 * @param {Request} request
 * @returns {boolean}
 */
export function verifyCronSecret(request) {
  const secret = process.env.CRON_SECRET?.trim();
  if (!secret) return false;

  const auth = request.headers.get("authorization")?.trim() ?? "";
  if (auth === `Bearer ${secret}`) return true;

  const headerSecret = request.headers.get("x-cron-secret")?.trim();
  return headerSecret === secret;
}
