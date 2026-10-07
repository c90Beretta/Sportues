import { Test, TestingModule } from '@nestjs/testing';
import { TokenQrController } from './token-qr.controller';
import { TokenQrService } from './token-qr.service';

describe('TokenQrController', () => {
  let controller: TokenQrController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [TokenQrController],
      providers: [TokenQrService],
    }).compile();

    controller = module.get<TokenQrController>(TokenQrController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
