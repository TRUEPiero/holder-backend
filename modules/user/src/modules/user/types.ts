type EntityParams = {
    id: number;
    name: string;
    password: string;
    status: string;
    email: string;
    telegram: string;
    telegramId: string;
    settings: any[];
}

type UpdateData = {
    name?: string,
    password?: string
}

type UpdateDataRepo = {
    name: string,
    password: string
}

type CreateData = {
    name: string,
    email: string,
    password: string
}

export type {
    EntityParams,
    UpdateData,
    UpdateDataRepo,
    CreateData
}
