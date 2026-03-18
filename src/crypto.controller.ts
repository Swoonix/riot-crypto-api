import { BadRequestException, Body, Controller, HttpCode, Post } from '@nestjs/common';
import { EncryptUseCase } from './usecases/encrypt.usecase';
import type { JsonObject } from './domain/types/json-object.type';
import { DecryptUseCase } from './usecases/decrypt.usecase';
import { SignUseCase } from './usecases/sign.usecase';
import { VerifyUseCase } from './usecases/verify.usecase';

@Controller()
export class CryptoController {
  constructor(private readonly encryptUseCase: EncryptUseCase, private decryptUseCase: DecryptUseCase, private signUseCase: SignUseCase, private verifyUseCase: VerifyUseCase) {}

  @Post('/encrypt')
  encrypt(@Body() body: JsonObject): JsonObject {
    return this.encryptUseCase.execute(body);
  }

  @Post('/decrypt')
  decrypt(@Body() body: JsonObject): JsonObject {
    return this.decryptUseCase.execute(body);
  }

  @Post('/sign')
  sign(@Body() body: JsonObject): JsonObject {
   return this.signUseCase.execute(body)
  }

  @Post('/verify')
  @HttpCode(204)
  verify(@Body() body: JsonObject): void {
    const isValid = this.verifyUseCase.execute(body);
    if (!isValid) throw new BadRequestException('Invalid signature');
  }
}
