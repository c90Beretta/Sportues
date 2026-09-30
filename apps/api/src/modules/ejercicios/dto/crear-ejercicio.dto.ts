import { IsArray, IsOptional, IsString, IsUUID } from "class-validator";

export class CrearEjercicioDto {
  @IsString()
  nombre!: string;

  @IsOptional()
  @IsString()
  descripcion?: string;

  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  gruposMusculares?: string[];

  @IsOptional()
  @IsUUID()
  equipoId?: string;
}