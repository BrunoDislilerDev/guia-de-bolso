import { NextResponse } from "next/server";
import { createDefaultUsage } from "@/lib/premium";
import { getAuthUser, getPerfilUsage } from "@/lib/premiumServer";

export async function GET() {
  try {
    const { user } = await getAuthUser();

    if (!user) {
      return NextResponse.json({
        loggedIn: false,
        usage: null,
      });
    }

    let usage;
    try {
      usage = await getPerfilUsage(user.id);
    } catch {
      usage = createDefaultUsage();
    }

    return NextResponse.json({
      loggedIn: true,
      usage,
    });
  } catch {
    return NextResponse.json(
      { loggedIn: false, usage: null, error: "Erro ao carregar uso do plano." },
      { status: 500 }
    );
  }
}
