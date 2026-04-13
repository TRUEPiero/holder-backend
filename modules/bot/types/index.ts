export type EntityType = "project" | "cashbox" | "transaction"

export type Step = {
    entity?: EntityType,
    type: string,
    id?: number | null
}

export type EntityHandler = {
    service: any,
    filter: any
    customFields: any[],
    menu: {
        list: (entity: EntityType, filter: any, limit?: number, page?: number) => Promise<any>,
        item: (item?: any) => any
    }
}