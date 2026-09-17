import { AppError } from "@common/errors";

class AlreadyCheckedError extends AppError {
    constructor () {
        super('INVITE_ALREADY_CHECKED', 409, `Invite already checked`)
    }
}

export {
    AlreadyCheckedError
}