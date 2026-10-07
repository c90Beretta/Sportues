import { PartialType } from '@nestjs/mapped-types';
import { CreateTokenQrDto } from './create-token-qr.dto';

export class UpdateTokenQrDto extends PartialType(CreateTokenQrDto) {}
