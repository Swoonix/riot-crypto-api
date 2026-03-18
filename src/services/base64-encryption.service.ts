import { JsonObject } from "src/domain/types/json-object.type";
import { EncryptionService } from "./encryption.service";

export class Base64EncryptionService implements EncryptionService {
    encrypt(data: JsonObject): JsonObject {
        const encodedResult: JsonObject = {}
        
        for (const [key, value] of Object.entries(data)) {
            encodedResult[key] = Buffer.from(JSON.stringify(value)).toString('base64');
        }

        return encodedResult
    }

    decrypt(data: JsonObject): JsonObject {
        const decodedResult: JsonObject = {};
    
        for (const [key, value] of Object.entries(data)) {
            try {
                const decoded = Buffer.from(value as string, 'base64').toString();
    
                // We use JSON.parse here to ensure that typing remains correct
                decodedResult[key] = JSON.parse(decoded);
            } catch (e) {
                decodedResult[key] = value;
            }
        }
    
        return decodedResult;
    }
}