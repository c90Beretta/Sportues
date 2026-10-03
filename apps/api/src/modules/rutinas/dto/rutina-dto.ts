import { Type } from "class-transformer";
import {
  ArrayMinSize,
  IsArray,
  IsIn,
  IsInt,
  IsOptional,
  IsString,
  IsUUID,
  Min,
  ValidateNested,
} from "class-validator";

export class EjercicioEnRutinaDto {
  @IsUUID()
  ejercicioId!: string;

  @IsInt()
  @Min(1)
  series!: number;

  @IsInt()
  @Min(1)
  repeticiones!: number;

  @IsOptional()
  @IsInt()
  @Min(0)
  descansoSegundos?: number;
}

export class CrearRutinaDto {
  @IsString()
  nombre!: string;

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

  @IsArray()
  @ArrayMinSize(1)
  @ValidateNested({ each: true })
  @Type(() => EjercicioEnRutinaDto)
  ejercicios!: EjercicioEnRutinaDto[];
}