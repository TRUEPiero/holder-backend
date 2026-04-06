import { Money } from "./Money";

export class CashboxEntity {
    public id: number;
    public balance: number;
    public title: string;
    public description: string;
    public parameters: any;
    public createdAt: Date;
    public updatedAt: Date;
    
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
    }

    public debit(amount: Money) {
        if (this.balance < amount.get()) {
            throw new Error();
        }
        this.balance -= amount.get();
    }

    public credit(amount: Money) {
        this.balance += amount.get();
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