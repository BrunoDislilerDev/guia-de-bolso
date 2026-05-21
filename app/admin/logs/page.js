import { Suspense } from "react";
import LogsGridPage from "@/components/admin/LogsGridPage";

/**
 * @returns {import("react").JSX.Element}
 */
function LogsLoading() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-[#f0f4f3] text-[#5a6b66]">
      Carregando logs...
    </div>
  );
}

/**
 * Admin — atividade e eventos do app.
 * @returns {import("react").JSX.Element}
 */
export default function AdminLogsPage() {
  return (
    <Suspense fallback={<LogsLoading />}>
      <LogsGridPage />
    </Suspense>
  );
}
