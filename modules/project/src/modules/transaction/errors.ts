import { AppError } from "@common/errors";

class SameIdError extends AppError {
    constructor() {
        super('SAME_ID', 422, 'Same id');
    }
}

class SameProjectError extends AppError {
    constructor() {
        super('SAME_ID', 422, 'ERROR');
    }
}

export {
    SameIdError,
    SameProjectError
}