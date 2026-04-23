import { AppError } from "@common/errors";

class NegativeAmountError extends AppError {
    constructor () {
        super('AMOUNT_MUST_BE_POSITIVE', 422, `Amount can't be negative`)
    }
}

class LessBalanceError extends AppError {
    constructor () {
        super('BALANSE_LESS_AMOUNT', 422, `Balance can't be less amount`)
    }
}

export {
    NegativeAmountError,
    LessBalanceError
}