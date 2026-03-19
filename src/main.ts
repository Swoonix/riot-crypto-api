import { NestFactory } from '@nestjs/core';
import { CryptoModule } from './crypto.module';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';

async function bootstrap() {
  const app = await NestFactory.create(CryptoModule);

  const config = new DocumentBuilder()
    .setTitle('Crypto API')
    .setDescription(
      'HTTP API for encryption, decryption, signing, and verification of JSON payloads.',
    )
    .setVersion('1.0')
    .build();

  const document = SwaggerModule.createDocument(app, config);

  SwaggerModule.setup('api-docs', app, document);

  await app.listen(process.env.PORT ?? 3000);
}
void bootstrap();
