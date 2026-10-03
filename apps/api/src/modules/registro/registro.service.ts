import { BadRequestException, ConflictException, Injectable, NotFoundException } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { hash } from "bcryptjs";
import { sign } from "jsonwebtoken";
import { Resend } from "resend";
import { PrismaService } from "../../prisma/prisma.service";
import { CrearCuentaDto } from "./dto/crear-cuenta.dto";
import { RestablecerPasswordDto } from "./dto/restablecer-password.dto";
import { SolicitarCodigoDto } from "./dto/solicitar-codigo.dto";
import { VerificarCodigoDto } from "./dto/verificar-codigo.dto";

const VENTANA_VERIFICACION_MINUTOS = 30;

@Injectable()
export class RegistroService {
  private readonly resend: Resend;

  constructor(
    private readonly prisma: PrismaService,
    private readonly config: ConfigService,
  ) {
    this.resend = new Resend(this.config.get<string>("RESEND_API_KEY"));
  }

  async solicitarCodigo(dto: SolicitarCodigoDto): Promise<{ mensaje: string; nombre: string }> {
    if (!dto.email.endsWith("@ues.mx")) {
      throw new BadRequestException("Debes usar tu correo institucional (@ues.mx)");
    }

    const numeroExpediente = dto.email.split("@")[0];
    const alumno = await this.prisma.padronUES.findUnique({ where: { numeroExpediente } });
    if (!alumno) {
      throw new NotFoundException("No encontramos ese expediente en el padrón de la UES");
    }

    const usuarioExistente = await this.prisma.usuario.findUnique({ where: { email: dto.email } });

    if (dto.proposito === "REGISTRO" && usuarioExistente?.estadoRegistro) {
      throw new ConflictException("Ya existe una cuenta registrada con este correo. Usa 'Olvidaste tu contraseña' si es tuya.");
    }
    if (dto.proposito === "RECUPERACION" && !usuarioExistente) {
      throw new NotFoundException("No hay ninguna cuenta registrada con este correo todavía");
    }

    const codigo = Math.floor(100000 + Math.random() * 900000).toString();
    const expiraEn = new Date(Date.now() + 10 * 60 * 1000);

    const { error } = await this.resend.emails.send({
      from: "UES FIT <onboarding@resend.dev>",
      to: dto.email,
      subject: "Tu código de verificación - UES FIT",
      html: `
        <p>Hola ${alumno.nombre},</p>
        <p>Tu código de verificación es:</p>
        <h2 style="letter-spacing: 4px;">${codigo}</h2>
        <p>Vence en 10 minutos. Si tú no solicitaste esto, ignora este correo.</p>
      `,
    });

    if (error) {
      console.error("Error al enviar correo con Resend:", error);
      throw new BadRequestException("No se pudo enviar el código a tu correo.");
    }

    await this.prisma.codigoVerificacion.create({
      data: { email: dto.email, codigo, expiraEn },
    });

    return { mensaje: "Código enviado a tu correo institucional", nombre: alumno.nombre };
  }

  async verificarCodigo(dto: VerificarCodigoDto): Promise<{ nombre: string; carrera: string }> {
    const registro = await this.prisma.codigoVerificacion.findFirst({
      where: { email: dto.email, codigo: dto.codigo, usado: false },
      orderBy: { createdAt: "desc" },
    });
    if (!registro) {
      throw new BadRequestException("Código incorrecto");
    }
    if (registro.expiraEn < new Date()) {
      throw new BadRequestException("El código ya expiró, solicita uno nuevo");
    }

    await this.prisma.codigoVerificacion.update({ where: { id: registro.id }, data: { usado: true } });

    const numeroExpediente = dto.email.split("@")[0];
    const alumno = await this.prisma.padronUES.findUniqueOrThrow({ where: { numeroExpediente } });

    return { nombre: alumno.nombre, carrera: alumno.carrera };
  }

  private async exigirVerificacionReciente(email: string): Promise<void> {
    const limite = new Date(Date.now() - VENTANA_VERIFICACION_MINUTOS * 60 * 1000);
    const verificado = await this.prisma.codigoVerificacion.findFirst({
      where: { email, usado: true, createdAt: { gte: limite } },
      orderBy: { createdAt: "desc" },
    });
    if (!verificado) {
      throw new BadRequestException("Primero debes verificar tu correo con un código reciente");
    }
  }

  async crearCuenta(dto: CrearCuentaDto): Promise<{ accessToken: string; mensaje: string }> {
    await this.exigirVerificacionReciente(dto.email);

    const existente = await this.prisma.usuario.findUnique({ where: { email: dto.email } });
    if (existente?.estadoRegistro) {
      throw new ConflictException("Ya existe una cuenta registrada con este correo");
    }

    const numeroExpediente = dto.email.split("@")[0];
    const alumno = await this.prisma.padronUES.findUniqueOrThrow({ where: { numeroExpediente } });
    const passwordHash = await hash(dto.password, 10);

    const usuario = await this.prisma.usuario.upsert({
      where: { email: dto.email },
      update: { passwordHash, estadoRegistro: "PENDIENTE" },
      create: {
        nombre: alumno.nombre,
        email: dto.email,
        passwordHash,
        rol: "ESTUDIANTE",
        numeroExpediente,
        carrera: alumno.carrera,
        estadoRegistro: "PENDIENTE",
      },
    });

    // Sesión corta, solo para terminar el registro — no es un login real todavía.
    const accessToken = sign(
      { sub: usuario.id, id: usuario.id, email: usuario.email, rol: usuario.rol },
      this.config.get<string>("JWT_SECRET") ?? "dev-secret",
      { expiresIn: "1h" },
    );

    return { accessToken, mensaje: "Cuenta creada. Continúa con tu perfil deportivo." };
  }

  async completarPerfil(
    usuarioId: string,
    nivelExperiencia: string,
    certificadoMedicoUrl: string,
  ): Promise<{ mensaje: string }> {
    await this.prisma.usuario.update({
      where: { id: usuarioId },
      data: { nivelExperiencia, certificadoMedicoUrl },
    });
    return { mensaje: "Perfil completado. Tu certificado médico está pendiente de revisión por el staff." };
  }

  async restablecerPassword(dto: RestablecerPasswordDto): Promise<{ mensaje: string }> {
    await this.exigirVerificacionReciente(dto.email);

    const usuario = await this.prisma.usuario.findUnique({ where: { email: dto.email } });
    if (!usuario) {
      throw new NotFoundException("No hay ninguna cuenta con este correo");
    }

    const passwordHash = await hash(dto.nuevaPassword, 10);
    await this.prisma.usuario.update({ where: { email: dto.email }, data: { passwordHash } });

    return { mensaje: "Contraseña actualizada. Ya puedes iniciar sesión." };
  }
}