import { Module } from '@nestjs/common';
import { TokenQrService } from './token-qr.service';
import { TokenQrController } from './token-qr.controller';

@Module({
  controllers: [TokenQrController],
  providers: [TokenQrService],
})
export class TokenQrModule {}
