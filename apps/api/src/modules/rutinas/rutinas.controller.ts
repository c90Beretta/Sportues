import {
  Body,
  Controller,
  Delete,
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

type PeticionAutenticada = Request & { user: { sub: string; rol: "ESTUDIANTE" | "STAFF" } };

@Controller("rutinas")
export class RutinasController {
  constructor(private readonly rutinasService: RutinasService) {}

  // STAFF crea OFICIALES, ESTUDIANTE crea PERSONALES — lo decide el servicio según el rol.
  @Roles(ROL_STAFF, ROL_ESTUDIANTE)
  @Post()
  crear(@Body() dto: CrearRutinaDto, @Req() req: PeticionAutenticada): Promise<Rutina> {
    return this.rutinasService.crear(dto, req.user);
  }

  @Roles(ROL_ESTUDIANTE)
  @Get("mias")
  misRutinas(@Req() req: PeticionAutenticada): Promise<Rutina[]> {
    return this.rutinasService.misRutinasPersonales(req.user.sub);
  }

  // Catálogo oficial, visible para todos, filtrable por nivel: /rutinas?nivel=INTERMEDIO
  @Roles(ROL_STAFF, ROL_ESTUDIANTE)
  @Get()
  listar(@Query("nivel") nivel?: string): Promise<Rutina[]> {
    return this.rutinasService.listarCatalogoOficial(nivel);
  }

  @Roles(ROL_STAFF, ROL_ESTUDIANTE)
  @Get(":id")
  obtener(@Param("id") id: string, @Req() req: PeticionAutenticada): Promise<Rutina> {
    return this.rutinasService.obtener(id, req.user);
  }

  @Roles(ROL_STAFF, ROL_ESTUDIANTE)
  @Patch(":id")
  actualizar(
    @Param("id") id: string,
    @Body() dto: ActualizarRutinaDto,
    @Req() req: PeticionAutenticada,
  ): Promise<Rutina> {
    return this.rutinasService.actualizar(id, dto, req.user);
  }

  @Roles(ROL_STAFF, ROL_ESTUDIANTE)
  @Delete(":id")
  @HttpCode(HttpStatus.NO_CONTENT)
  async eliminar(@Param("id") id: string, @Req() req: PeticionAutenticada): Promise<void> {
    await this.rutinasService.eliminar(id, req.user);
  }
}