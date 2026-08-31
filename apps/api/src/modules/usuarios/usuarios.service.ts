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
        membresiaId: dto.membresiaId ?? null,
      },
    });

    return this.sinPassword(usuario);
  }

  async listar(): Promise<UsuarioSinPassword[]> {
    const usuarios = await this.prisma.usuario.findMany({
      orderBy: { createdAt: "asc" },
      include: { membresia: true },
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
        membresiaId: dto.membresiaId,
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