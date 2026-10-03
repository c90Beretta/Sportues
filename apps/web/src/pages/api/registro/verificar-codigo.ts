import type { APIRoute } from "astro";
import { apiPost } from "../../../lib/api";

export const POST: APIRoute = async ({ request }) => {
  const body = await request.json().catch(() => null);
  if (!body) {
    return new Response(JSON.stringify({ error: "Datos inválidos" }), {
      status: 400,
      headers: { "Content-Type": "application/json" },
    });
  }

  const res = await apiPost("/registro/verificar-codigo", body);
  const data = await res.json().catch(() => ({}));

  return new Response(
    JSON.stringify(res.ok ? data : { error: data.message ?? "Código incorrecto" }),
    { status: res.status, headers: { "Content-Type": "application/json" } },
  );
};