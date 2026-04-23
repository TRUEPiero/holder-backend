import { AppError } from "@common/errors";

class InvalidEntity extends AppError {
    constructor() {
        super('INVALID_ENTITY', 422, 'Invalid query param: "entity"')
    }
}

export {
    InvalidEntity
}