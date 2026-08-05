type EntityParams = {
    id: number;
    email: string;
    code: string;
    isChecked: boolean;
    verifyToken: string;
    expiredAt: Date;
    createdAt: Date;
    updatedAt: Date;
}

type GetFilter = {
    email: string;
    code?: string;
    verifyToken?: string;
}

type RegisterData = {
    name: string;
    email: string;
    password: string;
    verify_code: string
}

type CreateData = {
    email: string;
    code: string;
    expiredAt: Date
}

type UpdateFilter = {
    code: string
}

type UpdateData = {
    isChecked: boolean,
    expiredAt: Date,
    verifyToken: string
}

export type {
    EntityParams,
    GetFilter,
    RegisterData,
    CreateData,
    UpdateFilter,
    UpdateData
}