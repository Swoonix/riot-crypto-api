import { Injectable } from '@nestjs/common';
import { JsonObject } from "src/domain/types/json-object.type";
import { EncryptionService } from "./encryption.service";

@Injectable()
export class Base64EncryptionService implements EncryptionService {
    encrypt(data: JsonObject): JsonObject {
        const encodedResult: Record<string, string> = {}
        
        for (const [key, value] of Object.entries(data)) {
            encodedResult[key] = Buffer.from(JSON.stringify(value)).toString('base64');
        }

        return encodedResult
    }
}