import { IsDateString, IsEmail, IsIn, IsOptional, IsString, MinLength } from "class-validator";

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
  @IsString()
  numeroExpediente?: string;

  @IsOptional()
  @IsString()
  carrera?: string;

  @IsOptional()
  @IsIn(["PRINCIPIANTE", "INTERMEDIO", "AVANZADO"])
  nivelExperiencia?: "PRINCIPIANTE" | "INTERMEDIO" | "AVANZADO";

  @IsOptional()
  @IsIn(["PENDIENTE", "APROBADO", "RECHAZADO"])
  estadoRegistro?: "PENDIENTE" | "APROBADO" | "RECHAZADO";

  @IsOptional()
  @IsString()
  certificadoMedicoUrl?: string;

  @IsOptional()
  @IsDateString()
  certificadoVigenteHasta?: string;
}