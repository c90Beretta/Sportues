import { IsEmail, IsString, Length } from "class-validator";

export class VerificarCodigoDto {
  @IsEmail()
  email!: string;

  @IsString()
  @Length(6, 6, { message: "El código debe tener 6 dígitos" })
  codigo!: string;
}