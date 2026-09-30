import type { APIRoute } from "astro";
import { getSession } from "../../../lib/auth";
import { API_URL } from "../../../lib/config";

export const POST: APIRoute = async ({ request, cookies }) => {
  const sesion = await getSession(cookies);
  if (!sesion) {
    return new Response(JSON.stringify({ error: "No autenticado" }), {
      status: 401,
      headers: { "Content-Type": "application/json" },
    });
  }

  const formData = await request.formData();

  const res = await fetch(`${API_URL}/registro/completar-perfil`, {
    method: "POST",
    headers: { Authorization: `Bearer ${sesion.token}` },
    body: formData,
  });
  const data = await res.json().catch(() => ({}));

  return new Response(
    JSON.stringify(res.ok ? data : { error: data.message ?? "No se pudo completar tu perfil" }),
    { status: res.status, headers: { "Content-Type": "application/json" } },
  );
};