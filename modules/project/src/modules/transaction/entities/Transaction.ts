export class TransactionEntity {
    public id: number;
    public amount: number;
    public description: string;
    public type: string;
    public tags: any[];
    public author: any;
    public cashbox: any;

    constructor(params: any) {
        this.id = params.id;
        this.amount = params.amount;
        this.description = params.description || '';
        this.type = params.type;
        this.tags = params.tags || [];
        this.author = params.author || {};
        this.cashbox = params.cashbox || {};
    }
}