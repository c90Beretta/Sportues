import { NotFoundException } from "@nestjs/common";
import { Test, TestingModule } from "@nestjs/testing";
import { PrismaService } from "../../prisma/prisma.service";
import { EjerciciosService } from "./ejercicios.service";

describe("EjerciciosService", () => {
  let service: EjerciciosService;
  const prisma = {
    ejercicio: {
      create: jest.fn(),
      findMany: jest.fn(),
      findUnique: jest.fn(),
      update: jest.fn(),
      delete: jest.fn(),
    },
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [EjerciciosService, { provide: PrismaService, useValue: prisma }],
    }).compile();

    service = module.get<EjerciciosService>(EjerciciosService);
    jest.clearAllMocks();
  });

  it("deberia estar definido", () => {
    expect(service).toBeDefined();
  });

  it("crear() deberia persistir un ejercicio", async () => {
    const payload = { nombre: "Press banca", descripcion: "Pecho", grupoMuscular: "Pecho" };
    prisma.ejercicio.create.mockResolvedValue({ id: "e1", ...payload, createdAt: new Date() });

    const resultado = await service.crear(payload);

    expect(prisma.ejercicio.create).toHaveBeenCalledWith({
      data: {
        nombre: payload.nombre,
        descripcion: payload.descripcion,
        grupoMuscular: payload.grupoMuscular,
      },
    });
    expect(resultado).toMatchObject({ id: "e1", nombre: "Press banca" });
  });

  it("listar() deberia devolver todos los ejercicios", async () => {
    prisma.ejercicio.findMany.mockResolvedValue([
      { id: "e1", nombre: "Sentadilla", descripcion: null, grupoMuscular: "Pierna", createdAt: new Date() },
    ]);

    const resultado = await service.listar();

    expect(resultado).toHaveLength(1);
    expect(resultado[0].nombre).toBe("Sentadilla");
  });

  it("obtener() deberia lanzar NotFoundException si no existe", async () => {
    prisma.ejercicio.findUnique.mockResolvedValue(null);

    await expect(service.obtener("no-existe")).rejects.toBeInstanceOf(NotFoundException);
  });
});