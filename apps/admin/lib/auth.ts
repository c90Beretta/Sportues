import { cookies } from "next/headers";
import { jwtVerify } from "jose";
import { getJwtSecret } from "./config";
import type { RolUsuario } from "@gimnasio/shared";

export interface SesionAdmin {
  token: string;
  usuario: {
    id: string;
    email: string;
    rol: RolUsuario;
  };
}

export async function getSession(): Promise<SesionAdmin | null> {
  const tokenStore = await cookies();
  const token = tokenStore.get("admin_session")?.value;

  if (!token) {
    return null;
  }

  const secreto = new TextEncoder().encode(getJwtSecret());

  try {
    const { payload } = await jwtVerify(token, secreto);
    return {
      token,
      usuario: payload as SesionAdmin["usuario"],
    };
  } catch {
    return null;
  }
}