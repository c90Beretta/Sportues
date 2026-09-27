import { Type } from "class-transformer";
import { IsArray, IsIn, IsOptional, IsString, ValidateNested } from "class-validator";
import { EjercicioEnRutinaDto } from "./rutina-dto";

export class ActualizarRutinaDto {
  @IsOptional()
  @IsString()
  nombre?: string;

  @IsOptional()
  @IsString()
  descripcion?: string;

  @IsOptional()
  @IsIn(["PRINCIPIANTE", "INTERMEDIO", "AVANZADO"])
  nivel?: "PRINCIPIANTE" | "INTERMEDIO" | "AVANZADO";

  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  gruposMusculares?: string[];

  @IsOptional()
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => EjercicioEnRutinaDto)
  ejercicios?: EjercicioEnRutinaDto[];
}