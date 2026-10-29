import { IsIn, IsInt, IsOptional, IsString, Min } from "class-validator";

export class CrearEquipoDto {
  @IsString()
  nombre!: string;

  @IsOptional()
  @IsString()
  categoria?: string;

  @IsOptional()
  @IsInt()
  @Min(1)
  cantidad?: number;

  @IsOptional()
  @IsString()
  ubicacion?: string;

  @IsOptional()
  @IsIn(["ACTIVA", "FUERA_DE_SERVICIO"])
  estado?: "ACTIVA" | "FUERA_DE_SERVICIO";

  @IsOptional()
  @IsString()
  notaFueraDeServicio?: string;
}