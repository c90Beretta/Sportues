import type { APIRoute } from "astro";
import { apiPost } from "../../../lib/api";

export const POST: APIRoute = async ({ request, cookies }) => {
  const body = await request.json().catch(() => null);
  if (!body) {
    return new Response(JSON.stringify({ error: "Datos inválidos" }), {
      status: 400,
      headers: { "Content-Type": "application/json" },
    });
  }

  const res = await apiPost("/registro/crear-cuenta", body);
  const data = await res.json().catch(() => ({}));

  if (!res.ok) {
    return new Response(JSON.stringify({ error: data.message ?? "No se pudo crear la cuenta" }), {
      status: res.status,
      headers: { "Content-Type": "application/json" },
    });
  }

  cookies.set("web_session", data.accessToken ?? "", {
    httpOnly: true,
    sameSite: "lax",
    secure: import.meta.env.PROD,
    path: "/",
    maxAge: 60 * 60, 
  });

  return new Response(JSON.stringify({ ok: true }), {
    headers: { "Content-Type": "application/json" },
  });
};