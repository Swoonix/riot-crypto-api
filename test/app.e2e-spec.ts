import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import request from 'supertest';
import { App } from 'supertest/types';
import { CryptoModule } from '../src/crypto.module';
import { JsonObject } from '../src/domain/types/json-object.type';

describe('Crypto endpoints (e2e)', () => {
  let app: INestApplication<App>;

  beforeEach(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [CryptoModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    await app.init();
  });

  afterEach(async () => {
    await app.close();
  });

  describe('/encrypt → /decrypt process', () => {
    it('should return the original payload after encrypt then decrypt', async () => {
      const original = {
        name: 'Hugo Sage',
        age: 29,
        contact: { email: 'hugosage@example.com', phone: '123-456-7890' },
      };

      const { body: encrypted } = (await request(app.getHttpServer())
        .post('/encrypt')
        .send(original)
        .expect(201)) as { body: JsonObject };

      const { body: decrypted } = (await request(app.getHttpServer())
        .post('/decrypt')
        .send(encrypted)
        .expect(201)) as { body: JsonObject };

      expect(decrypted).toEqual(original);
    });

    it('should preserve unencrypted properties through decrypt', async () => {
      const original = { name: 'Hugo Sage', age: 29 };

      const { body: encrypted } = (await request(app.getHttpServer())
        .post('/encrypt')
        .send(original)
        .expect(201)) as { body: JsonObject };

      const payloadWithExtra = { ...encrypted, birth_date: '1996-09-23' };

      const { body: decrypted } = (await request(app.getHttpServer())
        .post('/decrypt')
        .send(payloadWithExtra)
        .expect(201)) as { body: JsonObject };

      expect(decrypted).toEqual({ ...original, birth_date: '1996-09-23' });
    });
  });

  describe('/sign → /verify process', () => {
    it('should verify a payload signed with /sign', async () => {
      const data = { message: 'Hello World', timestamp: 1616161616 };

      const { body: signed } = (await request(app.getHttpServer())
        .post('/sign')
        .send(data)
        .expect(201)) as { body: { signature: string } };

      await request(app.getHttpServer())
        .post('/verify')
        .send({ signature: signed.signature, data })
        .expect(204);
    });

    it('should return 204 regardless of property order', async () => {
      const data = { message: 'Hello World', timestamp: 1616161616 };

      const { body: signed } = (await request(app.getHttpServer())
        .post('/sign')
        .send(data)
        .expect(201)) as { body: { signature: string } };

      await request(app.getHttpServer())
        .post('/verify')
        .send({
          signature: signed.signature,
          data: { timestamp: 1616161616, message: 'Hello World' },
        })
        .expect(204);
    });

    it('should return 400 when the payload has been modified', async () => {
      const data = { message: 'Hello World', timestamp: 1616161616 };

      const { body: signed } = (await request(app.getHttpServer())
        .post('/sign')
        .send(data)
        .expect(201)) as { body: { signature: string } };

      await request(app.getHttpServer())
        .post('/verify')
        .send({
          signature: signed.signature,
          data: { message: 'Goodbye World', timestamp: 1616161616 },
        })
        .expect(400);
    });

    it('should return 400 when the signature is invalid', async () => {
      await request(app.getHttpServer())
        .post('/verify')
        .send({
          signature: 'invalid-signature',
          data: { message: 'Hello World', timestamp: 1616161616 },
        })
        .expect(400);
    });
  });
});
