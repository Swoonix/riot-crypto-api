import { Inject, Injectable } from '@nestjs/common';
import type { JsonObject } from "src/domain/types/json-object.type";
import { SIGNING_SERVICE, type SigningService } from 'src/services/signing.service';

@Injectable()
export class SignUseCase {
    constructor(
        @Inject(SIGNING_SERVICE) private readonly signingService: SigningService
    ) {}

    execute(data: JsonObject): JsonObject {
        return this.signingService.sign(data)
    }
}