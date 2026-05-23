/**
 * Falha o build na Vercel se as variáveis públicas do Supabase não estiverem definidas.
 * Sem elas, o JS de produção não consegue buscar lugares (lista vazia na home).
 */
function assertSupabasePublicEnvForDeploy() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL?.trim();
  const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY?.trim();

  if (url && key) return;

  const message =
    "Build bloqueado: defina NEXT_PUBLIC_SUPABASE_URL e NEXT_PUBLIC_SUPABASE_ANON_KEY " +
    "na Vercel (Settings → Environment Variables, Production + Preview) e rode o deploy de novo.";

  if (process.env.VERCEL === "1") {
    throw new Error(message);
  }

  console.warn(`[next.config] ${message}`);
}

assertSupabasePublicEnvForDeploy();

/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "rsdjbqzjdyeaedyqwrvc.supabase.co",
        pathname: "/storage/v1/object/public/**",
      },
      {
        protocol: "https",
        hostname: "picsum.photos",
      },
    ],
  },
};

export default nextConfig;
