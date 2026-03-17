import { Base64EncryptionService } from "src/services/base64-encryption.service";

describe('Base64EncryptionService', () => {
    const base64EncryptionService: Base64EncryptionService = new Base64EncryptionService();
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
        const data = { user: { name: 'John', age: 22} }
        const result = base64EncryptionService.encrypt(data);
        expect(result).toEqual({
            user: Buffer.from(JSON.stringify({ name: 'John', age: 22 })).toString('base64'),
        });
       } )
    });
});