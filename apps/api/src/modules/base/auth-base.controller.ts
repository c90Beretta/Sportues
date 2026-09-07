import { SetMetadata } from '@nestjs/common';
import { IS_PUBLIC_KEY } from '../auth/decorators/public.decorator';
import { BaseController } from './base.controller';
import { Registro } from './base.service';

@SetMetadata(IS_PUBLIC_KEY, false)
export abstract class AuthBaseController<
  T extends Registro = Registro,
> extends BaseController<T> {}
