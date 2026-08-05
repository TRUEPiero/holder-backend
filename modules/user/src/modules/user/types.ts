type EntityParams = {
    id: number;
    name: string;
    password: string;
    status: string;
    email: string;
    telegram: string;
    telegramId: string;
}

type UpdateData = {
    name?: string,
    telegram?: string,
    telegramId?: string,
    password?: string
}

type UpdateDataRepo = {
    name: string,
    telegram: string,
    telegramId: string,
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