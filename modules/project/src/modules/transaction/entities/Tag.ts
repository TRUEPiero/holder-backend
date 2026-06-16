import { Entity } from "../../../interfaces/Entity";

export class TransactionTagEntity extends Entity {
    private title: string;
    private transactions: any[];

    constructor(params: any) {
        super(params);
        this.title = params.title;
        this.transactions = params.transactions;
    }

    public response() {
        return {
            id: this.id,
            title:this.title,
            transactions: this.transactions
        }
    }
}