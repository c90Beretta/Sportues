import type { APIRoute } from "astro";
import { getSession } from "../../lib/auth";
import { apiPost } from "../../lib/api";

export const POST: APIRoute = async ({ cookies, request }) => {
  const sesion = await getSession(cookies);

  if (!sesion) {
    return new Response(JSON.stringify({ error: "No autenticado" }), {
      status: 401,
      headers: { "Content-Type": "application/json" },
    });
  }

  const body = await request.json().catch(() => ({}));
  const res = await apiPost("/asistencias", body, sesion);
  const data = await res.json().catch(() => ({}));

  const status = res.ok ? 201 : res.status;
  return new Response(JSON.stringify(data), {
    status,
    headers: { "Content-Type": "application/json" },
  });
};