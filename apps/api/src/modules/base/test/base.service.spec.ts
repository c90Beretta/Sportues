import { NotFoundException } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { BaseService, DelegadoPrisma, Registro } from '../base.service';

type DelegadoFalso = {
  [K in keyof DelegadoPrisma]: jest.Mock;
};

class ServicioPrueba extends BaseService<Registro> {}

function primerArgumento<T>(mock: jest.Mock): T {
  const llamadas = mock.mock.calls as unknown[][];
  return llamadas[0][0] as T;
}

const crearDelegadoFalso = (): DelegadoFalso => ({
  findMany: jest.fn().mockResolvedValue([]),
  count: jest.fn().mockResolvedValue(0),
  findFirst: jest.fn().mockResolvedValue(null),
  create: jest.fn().mockResolvedValue({ id: 'nuevo' }),
  update: jest.fn().mockResolvedValue({ id: 'existente' }),
});

describe('BaseService', () => {
  let service: ServicioPrueba;
  let delegado: DelegadoFalso;

  beforeEach(async () => {
    delegado = crearDelegadoFalso();

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        {
          provide: ServicioPrueba,
          useFactory: () => new ServicioPrueba(delegado),
        },
      ],
    }).compile();

    service = module.get<ServicioPrueba>(ServicioPrueba);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('buscar', () => {
    it('fuerza eliminado: null y calcula skip = pagina * limite', async () => {
      await service.buscar({ where: { nombre: 'x' }, pagina: 2, limite: 10 });

      expect(delegado.findMany).toHaveBeenCalledWith(
        expect.objectContaining({
          where: { nombre: 'x', eliminado: null },
          skip: 20,
          take: 10,
          orderBy: { creado: 'desc' },
        }),
      );
      expect(delegado.count).toHaveBeenCalledWith({
        where: { nombre: 'x', eliminado: null },
      });
    });

    it('responde { datos, total, pagina, limite }', async () => {
      delegado.findMany.mockResolvedValue([{ id: 'a' }]);
      delegado.count.mockResolvedValue(1);

      const respuesta = await service.buscar({ pagina: 1, limite: 5 });

      expect(respuesta).toEqual({
        datos: [{ id: 'a' }],
        paginacion: {
          total: 1,
          pagina: 1,
          limite: 5,
        },
      });
    });

    it('acota limite fuera de rango', async () => {
      await service.buscar({ limite: 500 });
      expect(delegado.findMany).toHaveBeenCalledWith(
        expect.objectContaining({ take: 100 }),
      );

      await service.buscar({ limite: 0 });
      expect(delegado.findMany).toHaveBeenCalledWith(
        expect.objectContaining({ take: 1 }),
      );

      await service.buscar({ limite: Number.NaN });
      expect(delegado.findMany).toHaveBeenCalledWith(
        expect.objectContaining({ take: 20 }),
      );
    });

    it('acota pagina negativa o NaN a 0', async () => {
      await service.buscar({ pagina: -3, limite: 10 });
      expect(delegado.findMany).toHaveBeenCalledWith(
        expect.objectContaining({ skip: 0 }),
      );

      await service.buscar({ pagina: Number.NaN, limite: 10 });
      expect(delegado.findMany).toHaveBeenCalledWith(
        expect.objectContaining({ skip: 0 }),
      );
    });

    it('ordena con formato campo-direccion', async () => {
      await service.buscar({ ordenar: 'nombre-asc' });
      expect(delegado.findMany).toHaveBeenLastCalledWith(
        expect.objectContaining({ orderBy: { nombre: 'asc' } }),
      );

      await service.buscar({ ordenar: 'creado-desc' });
      expect(delegado.findMany).toHaveBeenLastCalledWith(
        expect.objectContaining({ orderBy: { creado: 'desc' } }),
      );
    });

    it('usa orden por defecto con formato inválido', async () => {
      await service.buscar({ ordenar: 'nombre' });
      expect(delegado.findMany).toHaveBeenLastCalledWith(
        expect.objectContaining({ orderBy: { creado: 'desc' } }),
      );
    });
  });

  describe('guardar', () => {
    it('sin id llama create y sella modificado', async () => {
      await service.guardar({ nombre: 'Mesa 1' });

      expect(delegado.create).toHaveBeenCalledTimes(1);
      expect(delegado.update).not.toHaveBeenCalled();

      const llamada = primerArgumento<{ data: Record<string, unknown> }>(
        delegado.create,
      );
      expect(llamada.data.nombre).toBe('Mesa 1');
      expect(llamada.data.modificado).toBeInstanceOf(Date);
    });

    it('con id llama update, sella modificado y no manda id en data', async () => {
      await service.guardar({ id: 'abc', nombre: 'Mesa 2' });

      expect(delegado.update).toHaveBeenCalledTimes(1);
      expect(delegado.create).not.toHaveBeenCalled();

      const llamada = primerArgumento<{
        where: { id: string };
        data: Record<string, unknown>;
      }>(delegado.update);
      expect(llamada.where).toEqual({ id: 'abc' });
      expect(llamada.data).not.toHaveProperty('id');
      expect(llamada.data.modificado).toBeInstanceOf(Date);
      expect(llamada.data.nombre).toBe('Mesa 2');
    });
  });

  describe('eliminar', () => {
    it('sella eliminado y modificado', async () => {
      delegado.findFirst.mockResolvedValue({ id: 'abc' });

      await service.eliminar('abc');

      const llamada = primerArgumento<{
        where: { id: string };
        data: Record<string, unknown>;
      }>(delegado.update);
      expect(llamada.where).toEqual({ id: 'abc' });
      expect(llamada.data.eliminado).toBeInstanceOf(Date);
      expect(llamada.data.modificado).toBeInstanceOf(Date);
    });

    it('lanza NotFoundException si el registro no existe', async () => {
      delegado.findFirst.mockResolvedValue(null);

      await expect(service.eliminar('inexistente')).rejects.toThrow(
        NotFoundException,
      );
      expect(delegado.update).not.toHaveBeenCalled();
    });
  });
});
