import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { CryptoController } from './crypto.controller';
import { EncryptUseCase } from './usecases/encrypt.usecase';
import { Base64EncryptionService } from './services/base64-encryption.service';
import { ENCRYPTION_SERVICE } from './services/encryption.service';

@Module({
  imports: [],
  controllers: [AppController, CryptoController],
  providers: [
    AppService,
    EncryptUseCase,
    {
      provide: ENCRYPTION_SERVICE,
      useClass: Base64EncryptionService,
    },
  ],
})
export class AppModule {}
