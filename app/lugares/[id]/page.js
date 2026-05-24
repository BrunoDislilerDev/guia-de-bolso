"use client";

import LugarDetalheAirbnb from "@/components/lugar/LugarDetalheAirbnb";
import LugarDetalheLegacy, {
  LugarDetalheShell,
} from "@/components/lugar/LugarDetalheLegacy";
import { useLugarDetalhe } from "@/hooks/useLugarDetalhe";
import { useLugarDetalheV2 } from "@/lib/lugarDetalheFeature";

/**
 * Página de detalhe do lugar — alterna layout legado ou redesign (Airbnb).
 * @returns {import("react").ReactElement}
 */
export default function LugarPage() {
  const data = useLugarDetalhe();
  const useV2 = useLugarDetalheV2();

  return (
    <LugarDetalheShell
      id={data.id}
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
