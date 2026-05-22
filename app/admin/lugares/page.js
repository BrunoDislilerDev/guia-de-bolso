import { Suspense } from "react";
import LugaresGridPage from "@/components/admin/LugaresGridPage";

/** Admin places grid page (legacy URL; same as /admin/locais). */
export default function AdminLugaresPage() {
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
