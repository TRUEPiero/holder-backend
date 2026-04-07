import { Money } from "./Money";

export class CashboxEntity {
    public id: number;
    public balance: number;
    public title: string;
    public description: string;
    public parameters: any;
    public createdAt: Date;
    public updatedAt: Date;
    public transactions: any[];
    
    constructor(
        params: any
    ) {
        this.id = params.id;
        this.balance = params.balance;
        this.title = params.title;
        this.description = params.description || '';
        this.parameters = params.parameters || {}
        this.createdAt = params.createdAt;
        this.updatedAt = params.updatedAt;
        this.transactions = params.transactions || [];
    }

    public debit(amount: Money) {
        if (this.balance < amount.get()) {
            throw new Error("BALANSE_LESS_AMOUNT");
        }
        this.balance -= amount.get();
    }

    public credit(amount: Money) {
        this.balance += amount.get();
    }

    public updateBalanse(amount: number) {

    }

    public getInfo(): any {
        return {
            id: this.id,
            title: this.title,
            description: this.description,
            parameters: this.parameters,
            balance: this.balance,
            createdAt: this.createdAt,
            updatedAt: this.updatedAt,
        }
    }
}