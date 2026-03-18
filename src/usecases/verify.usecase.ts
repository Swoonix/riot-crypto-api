import { Inject, Injectable } from '@nestjs/common';
import type { JsonObject } from "src/domain/types/json-object.type";
import { SIGNING_SERVICE, type SigningService } from 'src/services/signing.service';

@Injectable()
export class VerifyUseCase {
    constructor(
        @Inject(SIGNING_SERVICE) private readonly signingService: SigningService
    ) {}

    execute(body: JsonObject): boolean {
        const { signature, ...data } = body as { signature: string; data: JsonObject };
        return this.signingService.verify(signature, data);
    }
}