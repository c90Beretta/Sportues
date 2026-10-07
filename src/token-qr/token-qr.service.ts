import { Injectable } from '@nestjs/common';
import { CreateTokenQrDto } from './dto/create-token-qr.dto';
import { UpdateTokenQrDto } from './dto/update-token-qr.dto';

@Injectable()
export class TokenQrService {
  create(createTokenQrDto: CreateTokenQrDto) {
    return 'This action adds a new tokenQr';
  }

  findAll() {
    return `This action returns all tokenQr`;
  }

  findOne(id: number) {
    return `This action returns a #${id} tokenQr`;
  }

  update(id: number, updateTokenQrDto: UpdateTokenQrDto) {
    return `This action updates a #${id} tokenQr`;
  }

  remove(id: number) {
    return `This action removes a #${id} tokenQr`;
  }
}
