import type { APIRoute } from "astro";
import { getSession } from "../../lib/auth";
import { apiGet } from "../../lib/api";

function json(body: unknown, status: number) {
  return new Response(JSON.stringify(body), {
    status,
    headers: { "Content-Type": "application/json" },
  });
}

export const GET: APIRoute = async ({ cookies }) => {
  const sesion = await getSession(cookies);
  if (!sesion) return json({ error: "No autenticado" }, 401);

  try {
    return json(await apiGet("/ejercicios", sesion), 200);
  } catch {
    return json({ error: "No se pudo cargar el catálogo" }, 502);
  }
};