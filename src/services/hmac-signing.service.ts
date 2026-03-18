import { JsonObject } from "src/domain/types/json-object.type";
import { SigningService } from "./signing.service";
import { createHmac } from "node:crypto"
import stringify  from 'fast-json-stable-stringify'
import { Injectable } from "@nestjs/common";

@Injectable()
export class HmacSigningService implements SigningService {
    constructor(
        private readonly secret: string = '',
        private readonly excludedKeys: string[] = ['signature']
    ) {}

    // We do not want to sign a potential existing signature key
    private removeExcludedKeys(data: JsonObject): JsonObject {
        const result: JsonObject = {};

        for (const [key, value] of Object.entries(data)) {
            if (this.excludedKeys.includes(key)) continue;

            if (value && typeof value === 'object' && !Array.isArray(value)) {
                result[key] = this.removeExcludedKeys(value as JsonObject);
            } else {
                result[key] = value;
            }
        }

        return result;
    }

    sign(data: JsonObject): JsonObject {
        const cleaned = this.removeExcludedKeys(data);

        const payload = stringify(cleaned);

        const signature = createHmac('sha256', this.secret)
            .update(payload)
            .digest('hex');

        return { signature }
    }

    verify(signature: string, data: JsonObject): boolean {
        const expected = this.sign(data).signature as string;
        return signature === expected;
    }
}