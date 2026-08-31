import { IsEmail, IsIn, IsOptional, IsString, IsUUID, MinLength } from "class-validator";

export class CrearUsuarioDto {
  @IsString()
  nombre!: string;

  @IsEmail({}, { message: "El email no es válido" })
  email!: string;

  @IsString()
  @MinLength(6, { message: "La contraseña debe tener al menos 6 caracteres" })
  password!: string;

  @IsOptional()
  @IsIn(["ESTUDIANTE", "STAFF"])
  rol?: "ESTUDIANTE" | "STAFF";

  @IsOptional()
  @IsUUID()
  membresiaId?: string;
}