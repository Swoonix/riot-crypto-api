import { Inject, Injectable } from '@nestjs/common';
import type { JsonObject } from "src/domain/types/json-object.type";
import { ENCRYPTION_SERVICE } from "src/services/encryption.service";
import type { EncryptionService } from "src/services/encryption.service";

@Injectable()
export class DecryptUseCase {
    constructor(
        @Inject(ENCRYPTION_SERVICE) private readonly encryptionService: EncryptionService
    ) {}

    execute(data: JsonObject): JsonObject {
        return this.encryptionService.decrypt(data)
    }
}