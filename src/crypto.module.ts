import { Module } from '@nestjs/common';
import { CryptoController } from './crypto.controller';
import { EncryptUseCase } from './usecases/encrypt.usecase';
import { Base64EncryptionService } from './services/base64-encryption.service';
import { ENCRYPTION_SERVICE } from './services/encryption.service';
import { DecryptUseCase } from './usecases/decrypt.usecase';
import { SignUseCase } from './usecases/sign.usecase';
import { HmacSigningService } from './services/hmac-signing.service';
import { SIGNING_SERVICE } from './services/signing.service';
import { VerifyUseCase } from './usecases/verify.usecase';

@Module({
  imports: [],
  controllers: [CryptoController],
  providers: [
    EncryptUseCase,
    DecryptUseCase,
    SignUseCase,
    VerifyUseCase,
    {
      provide: ENCRYPTION_SERVICE,
      useClass: Base64EncryptionService,
    },
    {
      provide: SIGNING_SERVICE,
      useFactory: () => new HmacSigningService(process.env.HMAC_SECRET ?? 'default-secret')
    }
  ],
})
export class CryptoModule {}
