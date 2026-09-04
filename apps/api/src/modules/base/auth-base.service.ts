import { BaseService, Registro } from "./base.service";

// En Nest la autenticación vive en el guard global (BearerAuthGuard),
// no en el servicio, y los servicios son singletons.
// Existe para que un módulo protegido extienda el par completo.
export abstract class AuthBaseService<
  T extends Registro = Registro,
> extends BaseService<T> {}
