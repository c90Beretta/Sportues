import { IsEmail, IsIn } from "class-validator";

export class SolicitarCodigoDto {
  @IsEmail({}, { message: "El correo no es válido" })
  email!: string;

  @IsIn(["REGISTRO", "RECUPERACION"])
  proposito!: "REGISTRO" | "RECUPERACION";
}