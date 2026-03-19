import { JsonObject } from 'src/domain/types/json-object.type';

// Token used as an injection key
export const ENCRYPTION_SERVICE = 'ENCRYPTION_SERVICE';

// Interface for the encryption service. It's a contract that all encryption services must implement (example: Base64EncryptionService, AES256EncryptionService, etc.)
export interface EncryptionService {
  encrypt(data: JsonObject): JsonObject;
  decrypt(data: JsonObject): JsonObject;
}
