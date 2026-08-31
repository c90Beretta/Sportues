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
  Query,
  Req,
} from "@nestjs/common";
import { Request } from "express";
import type { Rutina } from "@gimnasio/shared";
import { ROL_ESTUDIANTE, ROL_STAFF } from "../auth/interfaces/usuario-auth.interface";
import { Roles } from "../auth/decorators/roles.decorator";
import { ActualizarRutinaDto } from "./dto/actualizar-rutina.dto";
import { CrearRutinaDto } from "./dto/rutina-dto";
import { RutinasService } from "./rutinas.service";

@Controller("rutinas")
export class RutinasController {
  constructor(private readonly rutinasService: RutinasService) {}

  @Roles(ROL_STAFF)
  @Post()
  crear(@Body() dto: CrearRutinaDto): Promise<Rutina> {
    return this.rutinasService.crear(dto);
  }

  @Roles(ROL_ESTUDIANTE)
  @Get("mias")
  misRutinas(@Req() req: Request & { user: { sub: string } }): Promise<Rutina[]> {
    return this.rutinasService.misRutinas(req.user.sub);
  }

  @Roles(ROL_STAFF)
  @Get()
  listar(@Query("estudianteId") estudianteId?: string): Promise<Rutina[]> {
    return this.rutinasService.listar(estudianteId);
  }

  @Roles(ROL_STAFF, ROL_ESTUDIANTE)
  @Get(":id")
  async obtener(
    @Param("id") id: string,
    @Req() req: Request & { user: { sub: string; rol: string } },
  ): Promise<Rutina> {
    const rutina = await this.rutinasService.obtener(id);
    if (req.user.rol !== ROL_STAFF && rutina.estudianteId !== req.user.sub) {
      throw new ForbiddenException("Solo puedes consultar tus propias rutinas");
    }
    return rutina;
  }

  @Roles(ROL_STAFF)
  @Patch(":id")
  actualizar(@Param("id") id: string, @Body() dto: ActualizarRutinaDto): Promise<Rutina> {
    return this.rutinasService.actualizar(id, dto);
  }

  @Roles(ROL_STAFF)
  @Delete(":id")
  @HttpCode(HttpStatus.NO_CONTENT)
  async eliminar(@Param("id") id: string): Promise<void> {
    await this.rutinasService.eliminar(id);
  }
}