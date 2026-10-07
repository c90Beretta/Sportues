import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { TokenQrService } from './token-qr.service';
import { CreateTokenQrDto } from './dto/create-token-qr.dto';
import { UpdateTokenQrDto } from './dto/update-token-qr.dto';

@Controller('token-qr')
export class TokenQrController {
  constructor(private readonly tokenQrService: TokenQrService) {}

  @Post()
  create(@Body() createTokenQrDto: CreateTokenQrDto) {
    return this.tokenQrService.create(createTokenQrDto);
  }

  @Get()
  findAll() {
    return this.tokenQrService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.tokenQrService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateTokenQrDto: UpdateTokenQrDto) {
    return this.tokenQrService.update(+id, updateTokenQrDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.tokenQrService.remove(+id);
  }
}
