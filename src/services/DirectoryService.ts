import db from "@common/prisma";
import { BaseService } from "./BaseService";
import type { PrismaModelName, PrismaTxClient } from "../types/index.ts";

export class DirectoryService<modelName extends PrismaModelName> extends BaseService<modelName> {

    public ColumnsToConnect: string[] = [];

    constructor(
        public Model: modelName, 
        public columns: string[],
        public client?: typeof db | PrismaTxClient
    ) {
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

    public async createItem(data: any): Promise<any> {
        
        const InitObject = Object.assign(
            {},
            {
                ...data,
            },
        );
        this.ConvertConnectedColumns(InitObject);
        
        return await (this.model as any).create({data: InitObject}) || null;
    }

    public async updateItem(id: number, data: any): Promise<any> {
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
        
        return item || null
    }

}