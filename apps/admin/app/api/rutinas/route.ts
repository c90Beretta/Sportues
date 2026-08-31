import { NextRequest, NextResponse } from "next/server";
import { crearRutinaSchema } from "@gimnasio/shared";
import { getSession } from "@/lib/auth";
import { apiPost } from "@/lib/api";

export async function POST(req: NextRequest) {
  const sesion = await getSession();
  if (!sesion) {
    return NextResponse.json({ error: "No autenticado" }, { status: 401 });
  }

  const body = await req.json().catch(() => null);
  const parsed = crearRutinaSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: "Datos inválidos" }, { status: 400 });
  }

  const res = await apiPost("/rutinas", parsed.data, sesion);

  if (!res.ok) {
    const data = await res.json().catch(() => ({}));
    return NextResponse.json(
      { error: data.message ?? "No se pudo crear la rutina" },
      { status: res.status },
    );
  }

  const data = await res.json();
  return NextResponse.json(data, { status: 201 });
}