import { IsOptional, IsString } from "class-validator";

export class ActualizarEjercicioDto {
  @IsOptional()
  @IsString()
  nombre?: string;

  @IsOptional()
  @IsString()
  descripcion?: string;

  @IsOptional()
  @IsString()
  grupoMuscular?: string;
}