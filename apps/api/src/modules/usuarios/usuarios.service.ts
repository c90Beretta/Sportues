import { ConflictException, Injectable, NotFoundException } from "@nestjs/common";
import { Usuario } from "@prisma/client";
import { hash } from "bcryptjs";
import { PrismaService } from "../../prisma/prisma.service";
import { ActualizarUsuarioDto } from "./dto/actualizar-usuario.dto";
import { CrearUsuarioDto } from "./dto/crear-usuario.dto";

export type UsuarioSinPassword = Omit<Usuario, "passwordHash">;

@Injectable()
export class UsuariosService {
  constructor(private readonly prisma: PrismaService) {}

  private sinPassword<T extends { passwordHash: string }>({ passwordHash: _, ...rest }: T): Omit<T, "passwordHash"> {
    return rest;
  }

  async crear(dto: CrearUsuarioDto): Promise<UsuarioSinPassword> {
    const existe = await this.prisma.usuario.findUnique({ where: { email: dto.email } });
    if (existe) {
      throw new ConflictException("Ya existe un usuario con ese email");
    }

    const usuario = await this.prisma.usuario.create({
      data: {
        nombre: dto.nombre,
        email: dto.email,
        passwordHash: await hash(dto.password, 10),
        rol: dto.rol ?? "ESTUDIANTE",
        numeroExpediente: dto.numeroExpediente ?? null,
        carrera: dto.carrera ?? null,
        nivelExperiencia: dto.nivelExperiencia ?? null,
        estadoRegistro: dto.estadoRegistro ?? null,
        certificadoMedicoUrl: dto.certificadoMedicoUrl ?? null,
        certificadoVigenteHasta: dto.certificadoVigenteHasta ? new Date(dto.certificadoVigenteHasta) : null,
      },
    });

    return this.sinPassword(usuario);
  }

  async listar(): Promise<UsuarioSinPassword[]> {
    const usuarios = await this.prisma.usuario.findMany({
      orderBy: { createdAt: "asc" },
    });
    return usuarios.map((u) => this.sinPassword(u));
  }

  async obtener(id: string): Promise<UsuarioSinPassword> {
    const usuario = await this.prisma.usuario.findUnique({ where: { id } });
    if (!usuario) {
      throw new NotFoundException("Usuario no encontrado");
    }
    return this.sinPassword(usuario);
  }

  async actualizar(id: string, dto: ActualizarUsuarioDto): Promise<UsuarioSinPassword> {
    await this.obtener(id);

    const usuario = await this.prisma.usuario.update({
      where: { id },
      data: {
        nombre: dto.nombre,
        email: dto.email,
        rol: dto.rol,
        numeroExpediente: dto.numeroExpediente,
        carrera: dto.carrera,
        nivelExperiencia: dto.nivelExperiencia,
        estadoRegistro: dto.estadoRegistro,
        certificadoMedicoUrl: dto.certificadoMedicoUrl,
        certificadoVigenteHasta: dto.certificadoVigenteHasta ? new Date(dto.certificadoVigenteHasta) : undefined,
        ...(dto.password ? { passwordHash: await hash(dto.password, 10) } : {}),
      },
    });

    return this.sinPassword(usuario);
  }

  async eliminar(id: string): Promise<void> {
    await this.obtener(id);
    await this.prisma.usuario.delete({ where: { id } });
  }
}