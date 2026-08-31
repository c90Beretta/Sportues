import { ForbiddenException, Injectable } from "@nestjs/common";
import { Prisma } from "@prisma/client";
import type { Asistencia } from "@gimnasio/shared";
import { PrismaService } from "../../prisma/prisma.service";
import { RegistrarAsistenciaDto } from "./dto/registrar-asistencia.dto";

const INCLUDE_ASISTENCIA = {
  estudiante: { select: { id: true, nombre: true, email: true } },
} satisfies Prisma.AsistenciaInclude;

type AsistenciaConEstudiante = Prisma.AsistenciaGetPayload<{
  include: typeof INCLUDE_ASISTENCIA;
}>;

@Injectable()
export class AsistenciasService {
  constructor(private readonly prisma: PrismaService) {}

  async registrar(
    dto: RegistrarAsistenciaDto,
    usuario: { sub: string; rol: "ESTUDIANTE" | "STAFF" },
  ): Promise<Asistencia> {
    const estudianteId = usuario.rol === "STAFF" ? (dto.estudianteId ?? usuario.sub) : usuario.sub;

    const asistencia = await this.prisma.asistencia.create({
      data: { estudianteId },
      include: INCLUDE_ASISTENCIA,
    });

    return this.mapear(asistencia);
  }

  async listar(
    usuario: { sub: string; rol: "ESTUDIANTE" | "STAFF" },
    estudianteId?: string,
  ): Promise<Asistencia[]> {
    let where: Prisma.AsistenciaWhereInput = {};

    if (estudianteId) {
      if (usuario.rol !== "STAFF" && usuario.sub !== estudianteId) {
        throw new ForbiddenException("Solo puedes consultar tus propias asistencias");
      }
      where = { estudianteId };
    } else if (usuario.rol === "ESTUDIANTE") {
      where = { estudianteId: usuario.sub };
    }

    const asistencias = await this.prisma.asistencia.findMany({
      where,
      orderBy: { fecha: "desc" },
      include: INCLUDE_ASISTENCIA,
    });

    return asistencias.map((a) => this.mapear(a));
  }

  private mapear(a: AsistenciaConEstudiante): Asistencia {
    return {
      id: a.id,
      estudianteId: a.estudianteId,
      estudiante: a.estudiante,
      fecha: a.fecha,
      createdAt: a.createdAt,
    };
  }
}