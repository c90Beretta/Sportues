import { Injectable, NotFoundException } from "@nestjs/common";
import { Prisma } from "@prisma/client";
import type { Rutina } from "@gimnasio/shared";
import { PrismaService } from "../../prisma/prisma.service";
import { ActualizarRutinaDto } from "./dto/actualizar-rutina.dto";
import { CrearRutinaDto } from "./dto/rutina-dto";

const INCLUDE_RUTINA = {
  estudiante: { select: { id: true, nombre: true, email: true } },
  ejercicios: {
    include: {
      ejercicio: { select: { id: true, nombre: true, grupoMuscular: true } },
    },
  },
} satisfies Prisma.RutinaInclude;

type RutinaConDetalles = Prisma.RutinaGetPayload<{ include: typeof INCLUDE_RUTINA }>;

@Injectable()
export class RutinasService {
  constructor(private readonly prisma: PrismaService) {}

  async crear(dto: CrearRutinaDto): Promise<Rutina> {
    const rutina = await this.prisma.rutina.create({
      data: {
        nombre: dto.nombre,
        descripcion: dto.descripcion ?? null,
        estudianteId: dto.estudianteId,
        ejercicios: {
          create: dto.ejercicios.map((e) => ({
            ejercicioId: e.ejercicioId,
            series: e.series,
            repeticiones: e.repeticiones,
            descansoSegundos: e.descansoSegundos ?? null,
          })),
        },
      },
      include: INCLUDE_RUTINA,
    });
    return this.mapear(rutina);
  }

  async listar(estudianteId?: string): Promise<Rutina[]> {
    const rutinas = await this.prisma.rutina.findMany({
      where: estudianteId ? { estudianteId } : undefined,
      orderBy: { createdAt: "desc" },
      include: INCLUDE_RUTINA,
    });
    return rutinas.map((r) => this.mapear(r));
  }

  async misRutinas(estudianteId: string): Promise<Rutina[]> {
    return this.listar(estudianteId);
  }

  async obtener(id: string): Promise<Rutina> {
    const rutina = await this.prisma.rutina.findUnique({ where: { id }, include: INCLUDE_RUTINA });
    if (!rutina) {
      throw new NotFoundException("Rutina no encontrada");
    }
    return this.mapear(rutina);
  }

  async actualizar(id: string, dto: ActualizarRutinaDto): Promise<Rutina> {
    await this.obtener(id);

    const { ejercicios, ...data } = dto;
    const rutina = await this.prisma.rutina.update({
      where: { id },
      data: {
        ...data,
        ...(ejercicios
          ? {
              ejercicios: {
                deleteMany: {},
                create: ejercicios.map((e) => ({
                  ejercicioId: e.ejercicioId,
                  series: e.series,
                  repeticiones: e.repeticiones,
                  descansoSegundos: e.descansoSegundos ?? null,
                })),
              },
            }
          : {}),
      },
      include: INCLUDE_RUTINA,
    });
    return this.mapear(rutina);
  }

  async eliminar(id: string): Promise<void> {
    await this.obtener(id);
    await this.prisma.rutina.delete({ where: { id } });
  }

  private mapear(r: RutinaConDetalles): Rutina {
    return {
      id: r.id,
      nombre: r.nombre,
      descripcion: r.descripcion,
      estudianteId: r.estudianteId,
      estudiante: r.estudiante,
      ejercicios: r.ejercicios.map((re) => ({
        ejercicioId: re.ejercicioId,
        series: re.series,
        repeticiones: re.repeticiones,
        descansoSegundos: re.descansoSegundos ?? undefined,
        nombre: re.ejercicio.nombre,
      })),
      createdAt: r.createdAt,
      updatedAt: r.updatedAt,
    };
  }
}