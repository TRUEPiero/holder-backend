import { BaseService } from "./BaseService";
import type { PrismaModelName } from "../types/type";

export class DirectoryService<modelName extends PrismaModelName> extends BaseService<modelName> {

    protected ColumnsToConnect: string[] = [];

    constructor(Model: modelName, columns: string[]) {
        super(Model);

        this.ColumnsToConnect.push(...columns);
    }

    private ConvertConnectedColumns(data: any) {
        for (const key in data) {
            if (this.ColumnsToConnect.some(Column => Column === key) && data[key]) {
                data[key] = {connect: {id: +data[key]}};
            }
        }
    }

    protected async createItem(data: any): Promise<{ data: any; }> {
        
        const InitObject = Object.assign(
            {},
            {
                ...data,
            },
        );
        this.ConvertConnectedColumns(InitObject);
        
        const item = await (this.model as any).create({data: InitObject})

        return {data: item || {}}
    }

    protected async updateItem(id: number, data: any): Promise<{ data: any; }> {
        const InitObject = Object.assign(
            {},
            {
                ...data,
            }
        );

        this.ConvertConnectedColumns(InitObject);

        const item = await (this.model as any).update({
            where: {id}, 
            data: InitObject
        })
        
        return {data: item || {}}
    }

}