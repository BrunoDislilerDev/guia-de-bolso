/**
 * Skeleton da tela de perfil logado.
 * @returns {import("react").JSX.Element}
 */
export default function PerfilSkeleton() {
  return (
    <div className="animate-pulse space-y-5" aria-hidden>
      <div className="h-44 rounded-3xl bg-white/80" />
      <div className="grid grid-cols-3 gap-2">
        {[1, 2, 3].map((item) => (
          <div key={item} className="h-20 rounded-2xl bg-white/80" />
        ))}
      </div>
      <div className="h-28 rounded-2xl bg-white/80" />
      <div className="h-24 rounded-2xl bg-white/80" />
      <div className="space-y-2">
        {[1, 2, 3].map((item) => (
          <div key={item} className="h-16 rounded-2xl bg-white/80" />
        ))}
      </div>
    </div>
  );
}
