import { NotFoundException } from '@nestjs/common';

export type Registro = { id: string };

export type DelegadoPrisma = {
  findMany: (...args: any[]) => Promise<unknown>;
  count: (...args: any[]) => Promise<unknown>;
  findFirst: (...args: any[]) => Promise<unknown>;
  create: (...args: any[]) => Promise<unknown>;
  update: (...args: any[]) => Promise<unknown>;
};

export type ParametrosBusqueda = {
  where?: Record<string, unknown>;
  limite?: number;
  pagina?: number;
  ordenar?: string;
};

export type Paginacion = {
  total: number;
  pagina: number;
  limite: number;
};

export type Respuesta<T> = {
  paginacion: Paginacion;
  datos: T[];
};

const LIMITE_POR_DEFECTO = 20;
const LIMITE_MAXIMO = 100;

export abstract class BaseService<T extends Registro = Registro> {
  protected ordenarPorDefecto: Record<string, 'asc' | 'desc'> = {
    creado: 'desc',
  };

  constructor(protected readonly delegado: DelegadoPrisma) {}

  async buscar(params: ParametrosBusqueda = {}): Promise<Respuesta<T>> {
    const valorLimite = Number(params.limite);
    const limite = Number.isNaN(valorLimite)
      ? LIMITE_POR_DEFECTO
      : Math.min(Math.max(Math.trunc(valorLimite), 1), LIMITE_MAXIMO);

    const valorPagina = Number(params.pagina);
    const pagina =
      Number.isNaN(valorPagina) || valorPagina < 0
        ? 0
        : Math.trunc(valorPagina);
    const where = { ...params.where, eliminado: null };

    const [datos, total] = await Promise.all([
      this.delegado.findMany({
        where,
        skip: pagina * limite,
        take: limite,
        orderBy: this.ordenPor(params.ordenar),
      }),
      this.delegado.count({ where }),
    ]);

    return {
      paginacion: {
        total: total as number,
        pagina: pagina,
        limite: limite,
      },
      datos: datos as T[],
    };
  }

  async porId(id: string): Promise<T | null> {
    const registro = await this.delegado.findFirst({
      where: { id, eliminado: null },
    });
    return (registro as T | null) ?? null;
  }

  async guardar(data: Record<string, unknown>): Promise<T> {
    const { id, ...campos } = data;
    const modificado = new Date();

    if (typeof id === 'string' && id) {
      const registro = await this.delegado.update({
        where: { id },
        data: { ...campos, modificado },
      });
      return registro as T;
    }

    const registro = await this.delegado.create({
      data: { ...campos, modificado },
    });
    return registro as T;
  }

  async eliminar(id: string): Promise<T> {
    if (!id) {
      throw new NotFoundException('Registro no encontrado.');
    }

    const existente = await this.porId(id);
    if (!existente) {
      throw new NotFoundException('Registro no encontrado.');
    }

    const registro = await this.delegado.update({
      where: { id },
      data: { eliminado: new Date(), modificado: new Date() },
    });
    return registro as T;
  }

  protected ordenPor(ordenar?: string): Record<string, 'asc' | 'desc'> {
    if (!ordenar) {
      return this.ordenarPorDefecto;
    }

    const [campo, direccion] = ordenar.split('-');
    if (!campo || (direccion !== 'asc' && direccion !== 'desc')) {
      return this.ordenarPorDefecto;
    }

    return { [campo]: direccion };
  }
}
