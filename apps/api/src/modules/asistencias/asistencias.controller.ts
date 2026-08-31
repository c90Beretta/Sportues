import { Body, Controller, Get, HttpCode, HttpStatus, Post, Query, Req } from "@nestjs/common";
import { Request } from "express";
import type { Asistencia } from "@gimnasio/shared";
import { ROL_ESTUDIANTE, ROL_STAFF } from "../auth/interfaces/usuario-auth.interface";
import { Roles } from "../auth/decorators/roles.decorator";
import { AsistenciasService } from "./asistencias.service";
import { RegistrarAsistenciaDto } from "./dto/registrar-asistencia.dto";

@Controller("asistencias")
export class AsistenciasController {
  constructor(private readonly asistenciasService: AsistenciasService) {}

  @Roles(ROL_STAFF, ROL_ESTUDIANTE)
  @Post()
  @HttpCode(HttpStatus.CREATED)
  registrar(
    @Body() dto: RegistrarAsistenciaDto,
    @Req() req: Request & { user: { sub: string; rol: "ESTUDIANTE" | "STAFF" } },
  ): Promise<Asistencia> {
    return this.asistenciasService.registrar(dto, req.user);
  }

  @Roles(ROL_STAFF, ROL_ESTUDIANTE)
  @Get()
  listar(
    @Req() req: Request & { user: { sub: string; rol: "ESTUDIANTE" | "STAFF" } },
    @Query("estudianteId") estudianteId?: string,
  ): Promise<Asistencia[]> {
    return this.asistenciasService.listar(req.user, estudianteId);
  }
}