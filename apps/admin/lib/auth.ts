import { cookies } from "next/headers";
import { jwtVerify } from "jose";
import { JWT_SECRET } from "./config";
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

  try {
    const { payload } = await jwtVerify(token, new TextEncoder().encode(JWT_SECRET));
    return {
      token,
      usuario: payload as SesionAdmin["usuario"],
    };
  } catch {
    return null;
  }
}