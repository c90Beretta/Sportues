import { IsEmail, IsIn, IsOptional, IsString, IsUUID, MinLength } from "class-validator";

export class ActualizarUsuarioDto {
  @IsOptional()
  @IsString()
  nombre?: string;

  @IsOptional()
  @IsEmail({}, { message: "El email no es válido" })
  email?: string;

  @IsOptional()
  @IsString()
  @MinLength(6, { message: "La contraseña debe tener al menos 6 caracteres" })
  password?: string;

  @IsOptional()
  @IsIn(["ESTUDIANTE", "STAFF"])
  rol?: "ESTUDIANTE" | "STAFF";

  @IsOptional()
  @IsUUID()
  membresiaId?: string;
}