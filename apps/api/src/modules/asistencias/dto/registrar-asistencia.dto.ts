import { IsOptional, IsUUID } from "class-validator";

export class RegistrarAsistenciaDto {
  @IsOptional()
  @IsUUID()
  estudianteId?: string;
}