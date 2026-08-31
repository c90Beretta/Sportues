import { IsOptional, IsString } from "class-validator";

export class CrearEjercicioDto {
  @IsString()
  nombre!: string;

  @IsOptional()
  @IsString()
  descripcion?: string;

  @IsOptional()
  @IsString()
  grupoMuscular?: string;
}