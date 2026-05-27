"use client";

import LugarDetalheAirbnb from "@/components/lugar/LugarDetalheAirbnb";
import LugarDetalheLegacy, {
  LugarDetalheShell,
} from "@/components/lugar/LugarDetalheLegacy";
import { useLugarDetalhe } from "@/hooks/useLugarDetalhe";
import { useLugarDetalheV2 } from "@/lib/lugarDetalheFeature";

/**
 * Detalhe do lugar (client) — `lugarId` vem do servidor após resolver slug/UUID.
 * @param {{ lugarId: string }} props
 * @returns {import("react").ReactElement}
 */
export default function LugarPageClient({ lugarId }) {
  const data = useLugarDetalhe(lugarId);
  const useV2 = useLugarDetalheV2();

  return (
    <LugarDetalheShell
      id={lugarId}
      loading={data.loading}
      fetchError={data.fetchError}
      router={data.router}
    >
      {data.lugar ? (
        useV2 ? (
          <LugarDetalheAirbnb {...data} />
        ) : (
          <LugarDetalheLegacy {...data} />
        )
      ) : null}
    </LugarDetalheShell>
  );
}
