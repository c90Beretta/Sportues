import { IsArray, IsOptional, IsString, IsUUID } from "class-validator";

export class ActualizarEjercicioDto {
  @IsOptional()
  @IsString()
  nombre?: string;

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