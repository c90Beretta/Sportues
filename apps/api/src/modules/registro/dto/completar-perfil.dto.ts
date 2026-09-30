import { IsIn } from "class-validator";

export class CompletarPerfilDto {
  @IsIn(["PRINCIPIANTE", "INTERMEDIO", "AVANZADO"])
  nivelExperiencia!: "PRINCIPIANTE" | "INTERMEDIO" | "AVANZADO";
}