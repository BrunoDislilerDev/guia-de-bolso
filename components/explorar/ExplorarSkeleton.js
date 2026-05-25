/**
 * Skeleton da tela Explorar durante carregamento.
 * @returns {import("react").JSX.Element}
 */
export default function ExplorarSkeleton() {
  return (
    <div className="animate-pulse space-y-10" aria-hidden>
      <div>
        <div className="mb-4 h-4 w-28 rounded-lg bg-[#e8eeee]" />
        <div className="h-6 w-44 rounded-lg bg-[#e8eeee]/90" />
        <div className="-mx-4 mt-4 flex gap-3 px-4">
          {[1, 2].map((item) => (
            <div key={item} className="h-[168px] w-[260px] shrink-0 rounded-[26px] bg-[#e8eeee]" />
          ))}
        </div>
      </div>

      <div>
        <div className="mb-4 h-6 w-40 rounded-lg bg-[#e8eeee]/90" />
        <div className="grid grid-cols-2 gap-3">
          {Array.from({ length: 6 }).map((_, index) => (
            <div key={index} className="h-[156px] rounded-[22px] bg-[#e8eeee]" />
          ))}
        </div>
      </div>

      <div className="space-y-3">
        <div className="h-[72px] rounded-[24px] bg-[#e8eeee]/90" />
        <div className="h-[72px] rounded-[24px] bg-[#e8eeee]/80" />
      </div>
    </div>
  );
}
