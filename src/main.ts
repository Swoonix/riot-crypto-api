import { NestFactory } from '@nestjs/core';
import { CryptoModule } from './crypto.module';

async function bootstrap() {
  const app = await NestFactory.create(CryptoModule);
  await app.listen(process.env.PORT ?? 3000);
}
bootstrap();
