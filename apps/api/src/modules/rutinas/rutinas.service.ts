import { ForbiddenException, Injectable, NotFoundException } from "@nestjs/common";
import { Prisma } from "@prisma/client";
import type { Rutina } from "@gimnasio/shared";
import { PrismaService } from "../../prisma/prisma.service";
import { ActualizarRutinaDto } from "./dto/actualizar-rutina.dto";
import { CrearRutinaDto } from "./dto/rutina-dto";

const INCLUDE_RUTINA = {
  creadaPor: { select: { id: true, nombre: true, email: true } },
  ejercicios: {
    orderBy: { orden: "asc" },
    include: {
      ejercicio: { select: { id: true, nombre: true, gruposMusculares: true } },
    },
  },
} satisfies Prisma.RutinaInclude;

type RutinaConDetalles = Prisma.RutinaGetPayload<{ include: typeof INCLUDE_RUTINA }>;
type UsuarioAutenticado = { sub: string; rol: "ESTUDIANTE" | "STAFF" };

@Injectable()
export class RutinasService {
  constructor(private readonly prisma: PrismaService) {}

  async crear(dto: CrearRutinaDto, creador: UsuarioAutenticado): Promise<Rutina> {
    const origen = creador.rol === "STAFF" ? "OFICIAL" : "PERSONAL";

    const rutina = await this.prisma.rutina.create({
      data: {
        nombre: dto.nombre,
        descripcion: dto.descripcion ?? null,
        origen,
        nivel: origen === "OFICIAL" ? (dto.nivel ?? null) : null,
        gruposMusculares: dto.gruposMusculares ?? [],
        creadaPorId: creador.sub,
        ejercicios: {
          create: dto.ejercicios.map((e, index) => ({
            ejercicioId: e.ejercicioId,
            orden: index,
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

  // Public catalog: OFICIAL routines only, optionally filtered by level.
  async listarCatalogoOficial(nivel?: string): Promise<Rutina[]> {
    const rutinas = await this.prisma.rutina.findMany({
      where: { origen: "OFICIAL", ...(nivel ? { nivel } : {}) },
      orderBy: { createdAt: "desc" },
      include: INCLUDE_RUTINA,
    });
    return rutinas.map((r) => this.mapear(r));
  }

  // A student's own PERSONAL routines.
  async misRutinasPersonales(estudianteId: string): Promise<Rutina[]> {
    const rutinas = await this.prisma.rutina.findMany({
      where: { creadaPorId: estudianteId, origen: "PERSONAL" },
      orderBy: { createdAt: "desc" },
      include: INCLUDE_RUTINA,
    });
    return rutinas.map((r) => this.mapear(r));
  }

  async obtener(id: string, viewer?: UsuarioAutenticado): Promise<Rutina> {
    const rutina = await this.prisma.rutina.findUnique({ where: { id }, include: INCLUDE_RUTINA });
    if (!rutina) {
      throw new NotFoundException("Rutina no encontrada");
    }
    const mapeada = this.mapear(rutina);

    // A PERSONAL routine is private: only its own creator, or STAFF, can see it.
    if (viewer && mapeada.origen === "PERSONAL" && viewer.rol !== "STAFF" && viewer.sub !== mapeada.creadaPorId) {
      throw new ForbiddenException("No puedes consultar la rutina personal de otro alumno");
    }
    return mapeada;
  }

  async actualizar(id: string, dto: ActualizarRutinaDto, quienModifica: UsuarioAutenticado): Promise<Rutina> {
    const existente = await this.obtener(id);
    if (quienModifica.rol !== "STAFF" && existente.creadaPorId !== quienModifica.sub) {
      throw new ForbiddenException("Solo puedes editar tus propias rutinas");
    }

    const { ejercicios, ...data } = dto;
    const rutina = await this.prisma.rutina.update({
      where: { id },
      data: {
        ...data,
        ...(ejercicios
          ? {
              ejercicios: {
                deleteMany: {},
                create: ejercicios.map((e, index) => ({
                  ejercicioId: e.ejercicioId,
                  orden: index,
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

  async eliminar(id: string, quienElimina: UsuarioAutenticado): Promise<void> {
    const existente = await this.obtener(id);
    if (quienElimina.rol !== "STAFF" && existente.creadaPorId !== quienElimina.sub) {
      throw new ForbiddenException("Solo puedes eliminar tus propias rutinas");
    }
    await this.prisma.rutina.delete({ where: { id } });
  }

  private mapear(r: RutinaConDetalles): Rutina {
    return {
      id: r.id,
      nombre: r.nombre,
      origen: r.origen as Rutina["origen"],
      nivel: r.nivel as Rutina["nivel"],
      descripcion: r.descripcion,
      gruposMusculares: r.gruposMusculares,
      creadaPorId: r.creadaPorId,
      creadaPor: r.creadaPor,
      ejercicios: r.ejercicios.map((re) => ({
        ejercicioId: re.ejercicioId,
        orden: re.orden,
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