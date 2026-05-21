import { Suspense } from "react";
import LugaresGridPage from "@/components/admin/LugaresGridPage";

/** Admin locais listing page (re-export of shared admin component). */
export default function AdminLocaisPage() {
  return (
    <Suspense
      fallback={
        <div className="flex min-h-screen items-center justify-center bg-[#f0f4f3] text-[#5a6b66]">
          Carregando admin...
        </div>
      }
    >
      <LugaresGridPage />
    </Suspense>
  );
}
