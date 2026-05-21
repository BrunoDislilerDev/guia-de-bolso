/**
 * Skeleton da tela Explorar durante carregamento.
 * @returns {import("react").JSX.Element}
 */
export default function ExplorarSkeleton() {
  return (
    <div className="animate-pulse space-y-6" aria-hidden>
      <div className="h-14 rounded-2xl bg-white/80" />
      <div className="flex gap-3">
        {[1, 2].map((item) => (
          <div key={item} className="h-[168px] w-[260px] shrink-0 rounded-2xl bg-white/80" />
        ))}
      </div>
      <div className="grid grid-cols-2 gap-3">
        {Array.from({ length: 6 }).map((_, index) => (
          <div key={index} className="h-[148px] rounded-2xl bg-white/80" />
        ))}
      </div>
    </div>
  );
}
