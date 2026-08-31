export type RolUsuarioAuth = "ESTUDIANTE" | "STAFF";

export interface UsuarioAuth {
  sub: string;
  id: string;
  email: string;
  rol: RolUsuarioAuth;
}

export const ROL_ESTUDIANTE: RolUsuarioAuth = "ESTUDIANTE";
export const ROL_STAFF: RolUsuarioAuth = "STAFF";