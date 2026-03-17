import { JsonObject } from "src/domain/types/json-object.type";
import { EncryptionService } from "src/services/encryption.service";

class EncryptUseCase {
    constructor(private encryptionService: EncryptionService) {}

    execute(data: JsonObject): JsonObject {
        return this.encryptionService.encrypt(data)
    }
}

export { EncryptUseCase }