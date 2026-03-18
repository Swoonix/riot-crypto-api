import { Inject, Injectable } from '@nestjs/common';
import type { JsonObject } from "src/domain/types/json-object.type";
import { SIGNING_SERVICE, type SigningService } from 'src/services/signing.service';

@Injectable()
export class VerifyUseCase {
    constructor(
        @Inject(SIGNING_SERVICE) private readonly signingService: SigningService
    ) {}

    execute(body: JsonObject): boolean {
        const { signature, data, ...rest } = body as { signature: string; data?: JsonObject } & JsonObject;
        // If we have a payload in data key, we try to verify this object. Otherwise, we try to verify top level keys.
        const payload = data ?? rest as JsonObject;
        return this.signingService.verify(signature, payload);
    }
}