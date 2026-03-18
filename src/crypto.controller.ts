import { BadRequestException, Body, Controller, HttpCode, Post } from '@nestjs/common';
import { EncryptUseCase } from './usecases/encrypt.usecase';
import type { JsonObject } from './domain/types/json-object.type';
import { DecryptUseCase } from './usecases/decrypt.usecase';
import { SignUseCase } from './usecases/sign.usecase';
import { VerifyUseCase } from './usecases/verify.usecase';
import { ApiDecrypt, ApiEncrypt, ApiSign, ApiVerify } from './crypto.controller.swagger';

@Controller()
export class CryptoController {
  constructor(private readonly encryptUseCase: EncryptUseCase, private readonly decryptUseCase: DecryptUseCase, private readonly signUseCase: SignUseCase, private readonly verifyUseCase: VerifyUseCase) {}

  @Post('/encrypt')
  @ApiEncrypt()
  encrypt(@Body() body: JsonObject): JsonObject {
    return this.encryptUseCase.execute(body);
  }

  @Post('/decrypt')
  @ApiDecrypt()
  decrypt(@Body() body: JsonObject): JsonObject {
    return this.decryptUseCase.execute(body);
  }

  @Post('/sign')
  @ApiSign()
  sign(@Body() body: JsonObject): JsonObject {
   return this.signUseCase.execute(body)
  }

  @Post('/verify')
  @HttpCode(204)
  @ApiVerify()
  verify(@Body() body: JsonObject): void {
    const isValid = this.verifyUseCase.execute(body);
    if (!isValid) throw new BadRequestException('Invalid signature');
  }
}
