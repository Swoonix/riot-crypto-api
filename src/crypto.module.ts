import { Module } from '@nestjs/common';
import { CryptoController } from './crypto.controller';
import { EncryptUseCase } from './usecases/encrypt.usecase';
import { Base64EncryptionService } from './services/base64-encryption.service';
import { ENCRYPTION_SERVICE } from './services/encryption.service';

@Module({
  imports: [],
  controllers: [CryptoController],
  providers: [
    EncryptUseCase,
    {
      provide: ENCRYPTION_SERVICE,
      useClass: Base64EncryptionService,
    },
  ],
})
export class CryptoModule {}
