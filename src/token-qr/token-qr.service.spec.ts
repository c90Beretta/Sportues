import { Test, TestingModule } from '@nestjs/testing';
import { TokenQrService } from './token-qr.service';

describe('TokenQrService', () => {
  let service: TokenQrService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [TokenQrService],
    }).compile();

    service = module.get<TokenQrService>(TokenQrService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
