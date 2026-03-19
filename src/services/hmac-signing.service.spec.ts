import { HmacSigningService } from 'src/services/hmac-signing.service';
import { createHmac } from 'node:crypto';
import stringify from 'fast-json-stable-stringify';

describe('HmacSigningService', () => {
  const secret = 'test-secret';
  const service = new HmacSigningService(secret);

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('sign', () => {
    it('should return only a signature property', () => {
      const data = { message: 'Hello World', timestamp: 1616161616 };
      const result = service.sign(data);
      expect(Object.keys(result)).toEqual(['signature']);
      expect(result.signature).toBeDefined();
      expect(typeof result.signature).toBe('string');
    });

    it('should produce the same signature regardless of property order', () => {
      const data1 = { message: 'Hello World', timestamp: 1616161616 };
      const data2 = { timestamp: 1616161616, message: 'Hello World' };
      const result1 = service.sign(data1);
      const result2 = service.sign(data2);
      expect(result1.signature).toBe(result2.signature);
    });

    it('should produce different signatures for different payloads', () => {
      const data1 = { message: 'Hello World', timestamp: 1616161616 };
      const data2 = { message: 'Goodbye World', timestamp: 1616161616 };
      const result1 = service.sign(data1);
      const result2 = service.sign(data2);
      expect(result1.signature).not.toBe(result2.signature);
    });

    it('should produce the expected HMAC-SHA256 signature', () => {
      const data = { message: 'Hello World', timestamp: 1616161616 };
      const expected = createHmac('sha256', secret)
        .update(stringify(data))
        .digest('hex');
      const result = service.sign(data);
      expect(result.signature).toBe(expected);
    });

    it('should exclude existing signature property when computing the new signature', () => {
      const dataWithoutSig = { message: 'Hello World' };
      const dataWithSig = {
        message: 'Hello World',
        signature: 'old-signature',
      };
      const result1 = service.sign(dataWithoutSig);
      const result2 = service.sign(dataWithSig);
      expect(result1.signature).toBe(result2.signature);
    });

    it('should produce different signatures when using different secrets', () => {
      const service2 = new HmacSigningService('other-secret');
      const data = { message: 'Hello World' };
      const result1 = service.sign(data);
      const result2 = service2.sign(data);
      expect(result1.signature).not.toBe(result2.signature);
    });

    it('should handle an empty object', () => {
      const result = service.sign({});
      expect(result.signature).toBeDefined();
      expect(typeof result.signature).toBe('string');
    });

    it('should handle nested objects', () => {
      const data = { user: { name: 'John', age: 30 }, active: true };
      const result = service.sign(data);
      expect(result.signature).toBeDefined();
      expect(typeof result.signature).toBe('string');
    });
  });

  describe('verify', () => {
    it('should return true for a valid signature', () => {
      const data = { message: 'Hello World', timestamp: 1616161616 };
      const { signature } = service.sign(data) as { signature: string };
      expect(service.verify(signature, data)).toBe(true);
    });

    it('should return false for a different payload', () => {
      const data = { message: 'Hello World', timestamp: 1616161616 };
      const { signature } = service.sign(data) as { signature: string };
      const tampered = { message: 'Goodbye World', timestamp: 1616161616 };
      expect(service.verify(signature, tampered)).toBe(false);
    });

    it('should return false for a different signature', () => {
      const data = { message: 'Hello World', timestamp: 1616161616 };
      expect(service.verify('random-signature', data)).toBe(false);
    });

    it('should return true regardless of property order', () => {
      const data1 = { message: 'Hello World', timestamp: 1616161616 };
      const data2 = { timestamp: 1616161616, message: 'Hello World' };
      const { signature } = service.sign(data1) as { signature: string };
      expect(service.verify(signature, data2)).toBe(true);
    });

    it('should return false when using a different secret', () => {
      const data = { message: 'Hello World', timestamp: 1616161616 };
      const { signature } = service.sign(data) as { signature: string };
      const otherService = new HmacSigningService('other-secret');
      expect(otherService.verify(signature, data)).toBe(false);
    });
  });
});
