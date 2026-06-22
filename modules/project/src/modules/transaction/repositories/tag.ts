import { BaseService } from "@services/BaseService";
import { TransactionTagEntity } from "../entities/Tag";
import { TransactionTag } from "../types";

export class TransactionTagRepository {
    constructor (
        private base: BaseService<'transactionTag'>
    ) {}

    public async findByFields(fields: any, include?: any) {
        const data = await this.base.getByFields(fields, include);
        return data.map((t: TransactionTag) => new TransactionTagEntity(t))
    }
}