import { Injectable, UnauthorizedException } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import type { AutenticacionResponse } from "@gimnasio/shared";
import { compare } from "bcryptjs";
import { sign } from "jsonwebtoken";
import { PrismaService } from "../../prisma/prisma.service";
import { LoginDto } from "./dto/login.dto";

@Injectable()
export class AuthService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly config: ConfigService,
  ) {}

  async login(dto: LoginDto): Promise<AutenticacionResponse> {
    const usuario = await this.prisma.usuario.findUnique({ where: { email: dto.email } });

    if (!usuario || !(await compare(dto.password, usuario.passwordHash))) {
      throw new UnauthorizedException("Credenciales inválidas");
    }

    const accessToken = sign(
      { sub: usuario.id, id: usuario.id, email: usuario.email, rol: usuario.rol },
      this.config.get<string>("JWT_SECRET") ?? "dev-secret",
      { expiresIn: "8h" },
    );

    const { passwordHash: _passwordHash, ...usuarioSinPassword } = usuario;
    return { accessToken, usuario: { ...usuarioSinPassword, rol: usuario.rol as AutenticacionResponse["usuario"]["rol"] } };
  }
}