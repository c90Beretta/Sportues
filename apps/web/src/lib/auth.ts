import type { AstroCookies } from "astro";
import { jwtVerify } from "jose";
import { getJwtSecret } from "./config";
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

  const secreto = new TextEncoder().encode(getJwtSecret());

  try {
    const { payload } = await jwtVerify(token, secreto);
    return {
      token,
      usuario: payload as SesionEstudiante["usuario"],
    };
  } catch {
    return null;
  }
}