import { SetMetadata } from "@nestjs/common";
import type { RolUsuarioAuth } from "../interfaces/usuario-auth.interface";

export const ROLES_KEY = "roles";

export const Roles = (...roles: RolUsuarioAuth[]) => SetMetadata(ROLES_KEY, roles);