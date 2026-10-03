import { BadRequestException, Body, Controller, Post, Req, UploadedFile, UseInterceptors } from "@nestjs/common";
import { FileInterceptor } from "@nestjs/platform-express";
import { Request } from "express";
import { Public } from "../auth/decorators/public.decorator";
import { Roles } from "../auth/decorators/roles.decorator";
import { ROL_ESTUDIANTE } from "../auth/interfaces/usuario-auth.interface";
import { RegistroService } from "./registro.service";
import { CompletarPerfilDto } from "./dto/completar-perfil.dto";
import { CrearCuentaDto } from "./dto/crear-cuenta.dto";
import { RestablecerPasswordDto } from "./dto/restablecer-password.dto";
import { SolicitarCodigoDto } from "./dto/solicitar-codigo.dto";
import { VerificarCodigoDto } from "./dto/verificar-codigo.dto";
import { certificadoMulterOptions } from "./multer.config";

@Controller("registro")
export class RegistroController {
  constructor(private readonly registroService: RegistroService) {}

  @Public()
  @Post("solicitar-codigo")
  solicitarCodigo(@Body() dto: SolicitarCodigoDto) {
    return this.registroService.solicitarCodigo(dto);
  }

  @Public()
  @Post("verificar-codigo")
  verificarCodigo(@Body() dto: VerificarCodigoDto) {
    return this.registroService.verificarCodigo(dto);
  }

  @Public()
  @Post("crear-cuenta")
  crearCuenta(@Body() dto: CrearCuentaDto) {
    return this.registroService.crearCuenta(dto);
  }

  @Roles(ROL_ESTUDIANTE)
  @Post("completar-perfil")
  @UseInterceptors(FileInterceptor("certificado", certificadoMulterOptions))
  completarPerfil(
    @UploadedFile() certificado: Express.Multer.File,
    @Body() dto: CompletarPerfilDto,
    @Req() req: Request & { user: { sub: string } },
  ) {
    if (!certificado) {
      throw new BadRequestException("El certificado médico es obligatorio");
    }
    return this.registroService.completarPerfil(
      req.user.sub,
      dto.nivelExperiencia,
      `/uploads/certificados/${certificado.filename}`,
    );
  }

  @Public()
  @Post("restablecer-password")
  restablecerPassword(@Body() dto: RestablecerPasswordDto) {
    return this.registroService.restablecerPassword(dto);
  }
}