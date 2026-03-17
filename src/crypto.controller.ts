import { Body, Controller, Get, Post } from '@nestjs/common';
import { EncryptUseCase } from './usecases/encrypt.usecase';
import type { JsonObject } from './domain/types/json-object.type';

@Controller()
export class CryptoController {
  constructor(private readonly encryptUseCase: EncryptUseCase) {}

  @Post()
  encrypt(@Body() body: { data: JsonObject }): JsonObject {
    return this.encryptUseCase.execute(body.data);
  }
}
