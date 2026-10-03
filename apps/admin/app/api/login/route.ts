import { NextRequest, NextResponse } from "next/server";
import { loginSchema } from "@gimnasio/shared";
import { apiPost } from "@/lib/api";

export async function POST(req: NextRequest) {
  const body = await req.json().catch(() => null);

  const parsed = loginSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: "Datos inválidos" }, { status: 400 });
  }

  const res = await apiPost("/auth/login", parsed.data);

  if (!res.ok) {
    return NextResponse.json(
      { error: "Credenciales inválidas" },
      { status: res.status },
    );
  }

  const data = (await res.json()) as { accessToken: string; usuario: { rol: string } };
  // todo: esto deberia ser middleware
  if (data.usuario.rol !== "STAFF") {
    return NextResponse.json(
      { error: "Este panel es solo para personal administrativo (STAFF)" },
      { status: 403 },
    );
  }

  console.log("Response:", NextRequest);

  const response = NextResponse.json({ ok: true });

  //? Constructor del set cookies
  //* set(...args: [key: string, value: string, cookie?: Partial<ResponseCookie>] | [options: ResponseCookie]): this;
  
  response.cookies.set("admin_session", data.accessToken, {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge: 60 * 60 * 8,
  });

  return response;
}