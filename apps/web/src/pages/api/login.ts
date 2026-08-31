import type { APIRoute } from "astro";
import { loginSchema } from "@gimnasio/shared";
import { apiPost } from "../../lib/api";

export const POST: APIRoute = async ({ request, cookies }) => {
  const body = await request.json().catch(() => null);
  const parsed = loginSchema.safeParse(body);

  if (!parsed.success) {
    return new Response(JSON.stringify({ error: "Datos inválidos" }), {
      status: 400,
      headers: { "Content-Type": "application/json" },
    });
  }

  const res = await apiPost("/auth/login", parsed.data);
  const data = (await res.json().catch(() => ({}))) as {
    accessToken?: string;
    message?: string;
    usuario?: { rol?: string };
  };

  if (!res.ok) {
    return new Response(
      JSON.stringify({ error: data.message ?? "Credenciales inválidas" }),
      { status: res.status, headers: { "Content-Type": "application/json" } },
    );
  }

  if (data.usuario?.rol !== "ESTUDIANTE") {
    return new Response(
      JSON.stringify({ error: "Esta aplicación es solo para estudiantes" }),
      { status: 403, headers: { "Content-Type": "application/json" } },
    );
  }

  cookies.set("web_session", data.accessToken ?? "", {
    httpOnly: true,
    sameSite: "lax",
    secure: import.meta.env.PROD,
    path: "/",
    maxAge: 60 * 60 * 8,
  });

  return new Response(JSON.stringify({ ok: true }), {
    headers: { "Content-Type": "application/json" },
  });
};