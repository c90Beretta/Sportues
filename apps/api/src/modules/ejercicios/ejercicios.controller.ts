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
import type { Ejercicio } from "@gimnasio/shared";
import { ROL_ESTUDIANTE, ROL_STAFF } from "../auth/interfaces/usuario-auth.interface";
import { Roles } from "../auth/decorators/roles.decorator";
import { ActualizarEjercicioDto } from "./dto/actualizar-ejercicio.dto";
import { CrearEjercicioDto } from "./dto/crear-ejercicio.dto";
import { EjerciciosService } from "./ejercicios.service";

@Controller("ejercicios")
export class EjerciciosController {
  constructor(private readonly ejerciciosService: EjerciciosService) {}

  @Roles(ROL_STAFF, ROL_ESTUDIANTE)
  @Get()
  listar(): Promise<Ejercicio[]> {
    return this.ejerciciosService.listar();
  }

  @Roles(ROL_STAFF)
  @Post()
  crear(@Body() dto: CrearEjercicioDto): Promise<Ejercicio> {
    return this.ejerciciosService.crear(dto);
  }

  @Roles(ROL_STAFF)
  @Patch(":id")
  actualizar(@Param("id") id: string, @Body() dto: ActualizarEjercicioDto): Promise<Ejercicio> {
    return this.ejerciciosService.actualizar(id, dto);
  }

  @Roles(ROL_STAFF)
  @Delete(":id")
  @HttpCode(HttpStatus.NO_CONTENT)
  async eliminar(@Param("id") id: string): Promise<void> {
    await this.ejerciciosService.eliminar(id);
  }
}