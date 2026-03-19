import { Base64EncryptionService } from 'src/services/base64-encryption.service';

describe('Base64EncryptionService', () => {
  const base64EncryptionService: Base64EncryptionService =
    new Base64EncryptionService();
  it('should be defined', () => {
    expect(base64EncryptionService).toBeDefined();
  });

  describe('encrypt', () => {
    it('should encrypt a JSON object', () => {
      const data = { name: 'John', age: 30 };
      const result = base64EncryptionService.encrypt(data);
      expect(result).toEqual({
        name: Buffer.from(JSON.stringify('John')).toString('base64'),
        age: Buffer.from(JSON.stringify(30)).toString('base64'),
      });
    });

    it('should encrypt all properties at depth 1 encrypted', () => {
      const data = { user: { name: 'John', age: 22 } };
      const result = base64EncryptionService.encrypt(data);
      expect(result).toEqual({
        user: Buffer.from(JSON.stringify({ name: 'John', age: 22 })).toString(
          'base64',
        ),
      });
    });
  });

  describe('decrypt', () => {
    it('should decrypt a JSON object with encrypted primitive values', () => {
      const encrypted = {
        name: Buffer.from(JSON.stringify('John')).toString('base64'),
        age: Buffer.from(JSON.stringify(30)).toString('base64'),
      };
      const result = base64EncryptionService.decrypt(encrypted);
      expect(result).toEqual({ name: 'John', age: 30 });
    });

    it('should decrypt a nested object encoded at depth 1', () => {
      const encrypted = {
        user: Buffer.from(JSON.stringify({ name: 'John', age: 22 })).toString(
          'base64',
        ),
      };
      const result = base64EncryptionService.decrypt(encrypted);
      expect(result).toEqual({ user: { name: 'John', age: 22 } });
    });

    it('should leave unencrypted properties unchanged', () => {
      const encrypted = {
        name: Buffer.from(JSON.stringify('John')).toString('base64'),
        birth_date: '1998-11-19',
      };
      const result = base64EncryptionService.decrypt(encrypted);
      expect(result).toEqual({ name: 'John', birth_date: '1998-11-19' });
    });

    it('should be the inverse of encrypt', () => {
      const original = {
        name: 'John Doe',
        age: 30,
        contact: { email: 'john@example.com', phone: '123-456-7890' },
      };
      const encrypted = base64EncryptionService.encrypt(original);
      const result = base64EncryptionService.decrypt(encrypted);
      expect(result).toEqual(original);
    });
  });
});
