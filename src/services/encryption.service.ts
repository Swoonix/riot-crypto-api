import { JsonObject } from "src/domain/types/json-object.type";

export interface EncryptionService {
    encrypt(data: JsonObject): JsonObject;
   // decrypt(data: unknown): unknown;
  }