export class TransactionEntity {
    public id: number;
    public amount: number;
    public description: string;
    public type: string;
    public tagId: number;
    public tag: any;
    public authorId: number;
    public author: any;
    public cashboxId: number;
    public cashbox: any;
    public createdAt: Date;

    constructor(params: any) {
        this.id = params.id;
        this.amount = params.amount;
        this.description = params.description || '';
        this.type = params.type;
        this.tagId = params.tagId;
        this.tag = params.tag || null;
        this.authorId = params.authorId;
        this.author = params.author || {};
        this.cashboxId = params.cashboxId;
        this.cashbox = params.cashbox || {};
        this.createdAt = params.createdAt;
    }
}