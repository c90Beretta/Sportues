import { Injectable, NotFoundException } from "@nestjs/common";
import { Equipo } from "@prisma/client";
import { PrismaService } from "../../prisma/prisma.service";
import { ActualizarEquipoDto } from "./dto/actualizar-equipo.dto";
import { CrearEquipoDto } from "./dto/crear-equipo.dto";

@Injectable()
export class EquiposService {
  constructor(private readonly prisma: PrismaService) {}

  crear(dto: CrearEquipoDto): Promise<Equipo> {
    return this.prisma.equipo.create({
      data: {
        nombre: dto.nombre,
        categoria: dto.categoria ?? null,
        cantidad: dto.cantidad ?? 1,
        ubicacion: dto.ubicacion ?? null,
        estado: dto.estado ?? "ACTIVA",
        notaFueraDeServicio: dto.notaFueraDeServicio ?? null,
      },
    });
  }

  listar(): Promise<Equipo[]> {
    return this.prisma.equipo.findMany({ orderBy: { nombre: "asc" } });
  }

  async obtener(id: string): Promise<Equipo> {
    const equipo = await this.prisma.equipo.findUnique({ where: { id } });
    if (!equipo) {
      throw new NotFoundException("Equipo no encontrado");
    }
    return equipo;
  }

  async actualizar(id: string, dto: ActualizarEquipoDto): Promise<Equipo> {
    await this.obtener(id);

    // When a machine goes back to ACTIVA, clear the old out-of-service note
    // unless a new one was sent explicitly.
    const limpiarNota = dto.estado === "ACTIVA" && dto.notaFueraDeServicio === undefined;

    return this.prisma.equipo.update({
      where: { id },
      data: { ...dto, ...(limpiarNota ? { notaFueraDeServicio: null } : {}) },
    });
  }

  async eliminar(id: string): Promise<void> {
    await this.obtener(id);

    // NotaMantenimiento has a required FK (ON DELETE RESTRICT), so its rows
    // must be removed first or the delete would fail with a 500.
    await this.prisma.$transaction([
      this.prisma.notaMantenimiento.deleteMany({ where: { equipoId: id } }),
      this.prisma.equipo.delete({ where: { id } }),
    ]);
  }
}
