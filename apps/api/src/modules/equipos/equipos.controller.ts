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
} from "@nestjs/common";
import { Equipo } from "@prisma/client";
import { ROL_ESTUDIANTE, ROL_STAFF } from "../auth/interfaces/usuario-auth.interface";
import { Roles } from "../auth/decorators/roles.decorator";
import { ActualizarEquipoDto } from "./dto/actualizar-equipo.dto";
import { CrearEquipoDto } from "./dto/crear-equipo.dto";
import { EquiposService } from "./equipos.service";

@Controller("equipos")
export class EquiposController {
  constructor(private readonly equiposService: EquiposService) {}

  @Roles(ROL_STAFF, ROL_ESTUDIANTE)
  @Get()
  listar(): Promise<Equipo[]> {
    return this.equiposService.listar();
  }

  @Roles(ROL_STAFF, ROL_ESTUDIANTE)
  @Get(":id")
  obtener(@Param("id") id: string): Promise<Equipo> {
    return this.equiposService.obtener(id);
  }

  @Roles(ROL_STAFF)
  @Post()
  crear(@Body() dto: CrearEquipoDto): Promise<Equipo> {
    return this.equiposService.crear(dto);
  }

  @Roles(ROL_STAFF)
  @Patch(":id")
  actualizar(@Param("id") id: string, @Body() dto: ActualizarEquipoDto): Promise<Equipo> {
    return this.equiposService.actualizar(id, dto);
  }

  @Roles(ROL_STAFF)
  @Delete(":id")
  @HttpCode(HttpStatus.NO_CONTENT)
  async eliminar(@Param("id") id: string): Promise<void> {
    await this.equiposService.eliminar(id);
  }
}
