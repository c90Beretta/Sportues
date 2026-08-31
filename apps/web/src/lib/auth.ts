import type { AstroCookies } from "astro";
import { jwtVerify } from "jose";
import { JWT_SECRET } from "./config";
import type { RolUsuario } from "@gimnasio/shared";

export interface SesionEstudiante {
  token: string;
  usuario: {
    id: string;
    email: string;
    rol: RolUsuario;
  };
}

export async function getSession(
  cookies: AstroCookies,
): Promise<SesionEstudiante | null> {
  const token = cookies.get("web_session")?.value;

  if (!token) {
    return null;
  }

  try {
    const { payload } = await jwtVerify(token, new TextEncoder().encode(JWT_SECRET));
    return {
      token,
      usuario: payload as SesionEstudiante["usuario"],
    };
  } catch {
    return null;
  }
}