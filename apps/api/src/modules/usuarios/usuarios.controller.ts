import {
  Body,
  Controller,
  Delete,
  ForbiddenException,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  Patch,
  Post,
  Req,
} from "@nestjs/common";
import { Request } from "express";
import { ROL_ESTUDIANTE, ROL_STAFF } from "../auth/interfaces/usuario-auth.interface";
import { Roles } from "../auth/decorators/roles.decorator";
import { ActualizarUsuarioDto } from "./dto/actualizar-usuario.dto";
import { CrearUsuarioDto } from "./dto/crear-usuario.dto";
import { UsuariosService, UsuarioSinPassword } from "./usuarios.service";

@Controller("usuarios")
export class UsuariosController {
  constructor(private readonly usuariosService: UsuariosService) {}

  @Roles(ROL_STAFF)
  @Post()
  crear(@Body() dto: CrearUsuarioDto): Promise<UsuarioSinPassword> {
    return this.usuariosService.crear(dto);
  }

  @Roles(ROL_STAFF)
  @Get()
  listar(): Promise<UsuarioSinPassword[]> {
    return this.usuariosService.listar();
  }

  @Roles(ROL_STAFF, ROL_ESTUDIANTE)
  @Get(":id")
  async obtener(
    @Param("id") id: string,
    @Req() req: Request & { user: { sub: string; rol: string } },
  ): Promise<UsuarioSinPassword> {
    if (req.user.rol !== ROL_STAFF && req.user.sub !== id) {
      throw new ForbiddenException("Solo puedes consultar tu propio perfil");
    }
    return this.usuariosService.obtener(id);
  }

  @Roles(ROL_STAFF)
  @Patch(":id")
  actualizar(@Param("id") id: string, @Body() dto: ActualizarUsuarioDto): Promise<UsuarioSinPassword> {
    return this.usuariosService.actualizar(id, dto);
  }

  @Roles(ROL_STAFF)
  @Delete(":id")
  @HttpCode(HttpStatus.NO_CONTENT)
  async eliminar(@Param("id") id: string): Promise<void> {
    await this.usuariosService.eliminar(id);
  }
}