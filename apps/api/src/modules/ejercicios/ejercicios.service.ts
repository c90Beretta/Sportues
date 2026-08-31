import { Injectable, NotFoundException } from "@nestjs/common";
import { Ejercicio as PrismaEjercicio } from "@prisma/client";
import type { Ejercicio } from "@gimnasio/shared";
import { PrismaService } from "../../prisma/prisma.service";
import { ActualizarEjercicioDto } from "./dto/actualizar-ejercicio.dto";
import { CrearEjercicioDto } from "./dto/crear-ejercicio.dto";

@Injectable()
export class EjerciciosService {
  constructor(private readonly prisma: PrismaService) {}

  async crear(dto: CrearEjercicioDto): Promise<Ejercicio> {
    const ejercicio = await this.prisma.ejercicio.create({
      data: {
        nombre: dto.nombre,
        descripcion: dto.descripcion ?? null,
        grupoMuscular: dto.grupoMuscular ?? null,
      },
    });
    return this.mapear(ejercicio);
  }

  async listar(): Promise<Ejercicio[]> {
    const ejercicios = await this.prisma.ejercicio.findMany({ orderBy: { nombre: "asc" } });
    return ejercicios.map((e) => this.mapear(e));
  }

  async obtener(id: string): Promise<Ejercicio> {
    const ejercicio = await this.prisma.ejercicio.findUnique({ where: { id } });
    if (!ejercicio) {
      throw new NotFoundException("Ejercicio no encontrado");
    }
    return this.mapear(ejercicio);
  }

  async actualizar(id: string, dto: ActualizarEjercicioDto): Promise<Ejercicio> {
    await this.obtener(id);
    const ejercicio = await this.prisma.ejercicio.update({
      where: { id },
      data: {
        nombre: dto.nombre,
        descripcion: dto.descripcion,
        grupoMuscular: dto.grupoMuscular,
      },
    });
    return this.mapear(ejercicio);
  }

  async eliminar(id: string): Promise<void> {
    await this.obtener(id);
    await this.prisma.ejercicio.delete({ where: { id } });
  }

  private mapear(e: PrismaEjercicio): Ejercicio {
    return {
      id: e.id,
      nombre: e.nombre,
      descripcion: e.descripcion,
      grupoMuscular: e.grupoMuscular,
      createdAt: e.createdAt,
    };
  }
}