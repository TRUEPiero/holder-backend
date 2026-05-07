export class TransactionTagEntity {
    private id: number;
    private title: string;
    private transactions: any[];

    constructor(params: any) {
        this.id = params.id;
        this.title = params.title;
        this.transactions = params.transactions;
    }

    public toJSON() {
        return {
            id: this.id,
            title:this.title,
            transactions: this.transactions
        }
    }
}