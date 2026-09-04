import { Body, Delete, Get, Post, Query } from "@nestjs/common";
import { Public } from "../auth/decorators/public.decorator";
import { BaseService, Registro, Respuesta } from "./base.service";

export type Accion = "buscar" | "guardar" | "eliminar";

@Public()
export abstract class BaseController<T extends Registro = Registro> {
  constructor(protected readonly servicio: BaseService<T>) {}

  @Get()
  async buscar(@Query() query: Record<string, string>): Promise<Respuesta<T>> {
    this.antesDeAccion("buscar");

    const where: Record<string, unknown> = {};
    this.buscador(where, query);

    return this.servicio.buscar({
      where,
      limite: Number(query.limite),
      pagina: Number(query.pagina),
      ordenar: query.ordenar,
    });
  }

  @Post("guardar")
  async guardar(@Body() data: Record<string, unknown>): Promise<T> {
    this.antesDeAccion("guardar");
    return this.servicio.guardar(data);
  }

  @Delete("eliminar")
  async eliminar(@Query("id") id: string): Promise<T> {
    this.antesDeAccion("eliminar");
    return this.servicio.eliminar(id);
  }

  protected buscador(
    where: Record<string, unknown>,
    query: Record<string, string>,
  ): void {
    if (query.id) {
      where.id = query.id;
    }
  }

  protected antesDeAccion(accion: Accion): void {
    void accion;
  }
}
