export default function PlaceCardSkeleton() {
  return (
    <div className="min-h-[380px] animate-pulse overflow-hidden rounded-2xl bg-white shadow-sm">
      <div className="h-[220px] bg-[#e3e9e6]" />
      <div className="space-y-3 p-4">
        <div className="h-5 w-2/3 rounded-lg bg-[#e3e9e6]" />
        <div className="h-4 w-1/3 rounded-lg bg-[#e3e9e6]" />
        <div className="h-4 w-full rounded-lg bg-[#e3e9e6]" />
      </div>
    </div>
  );
}
