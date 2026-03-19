import { JsonObject } from 'src/domain/types/json-object.type';

// Token used as an injection key
export const SIGNING_SERVICE = 'SIGNING_SERVICE';

export interface SigningService {
  sign(data: JsonObject): JsonObject;
  verify(signature: string, data: JsonObject): boolean;
}
