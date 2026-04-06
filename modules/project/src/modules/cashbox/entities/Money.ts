export class Money {
    constructor (
        private amount: number
    ) {
        if (!Number.isFinite(amount)) {
            throw new Error("INVALID_AMOUNT");
        }
        if (amount <= 0) {
            throw new Error("AMOUNT_MUST_BE_POSITIVE");
        }
    }

    get() {
        return this.amount;
    }
}