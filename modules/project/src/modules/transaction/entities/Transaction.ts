import { Entity } from "../../../interfaces/Entity";
import { TransactionTypes } from "../types";

export class TransactionEntity extends Entity {
    private amount: number;
    private description: string;
    private type: TransactionTypes;
    private tagId: number;
    private tag: any;
    private authorId: number;
    private author: any;
    private cashboxId: number;
    private cashbox: any;
    private createdAt: Date;

    constructor(params: any) {
        super(params)
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

    public getType() {
        return this.type
    }

    public getCreatedAt() {
        return this.createdAt
    }

    public getTag() {
        return this.tag
    }

    public getAmount() {
        return this.amount
    }

    public response() {
        return {
            id: this.id,
            amount: this.amount,
            cashboxId: this.cashboxId,
            authorId: this.authorId,
            description: this.description,
            type: this.type,
            tagId: this.tagId,
            tag: this.tag,
            author: this.author,
            cashbox: this.cashbox,
            createdAt: this.createdAt,
        }
    }
}