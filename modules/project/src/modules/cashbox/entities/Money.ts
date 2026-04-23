import { InvalidFieldError } from "@common/errors";
import { NegativeAmountError } from "../errors";

export class Money {
    constructor (
        private amount: number
    ) {
        if (!Number.isFinite(amount)) {
            throw new InvalidFieldError("AMOUNT");
        }
        if (amount <= 0) {
            throw new NegativeAmountError();
        }
    }

    get() {
        return this.amount;
    }
}