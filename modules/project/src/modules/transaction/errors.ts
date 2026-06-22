import { AppError } from "@common/errors";

class SameIdError extends AppError {
    constructor() {
        super('SAME_ID', 422, 'Same id');
    }
}

class AlreadyCalceledError extends AppError {
    constructor() {
        super('TRANSACTIONS_ALREADY_CANCELED', 400, 'transactions already canceled')
    }
}

export {
    SameIdError,
    AlreadyCalceledError
}