import { t } from 'elysia';
import { Cashbox, ResponseCashbox } from '../cashbox/types';
import { setting } from '@schemas/common';
import { DecimalType } from '@shared-types/index';
import { Member } from '../member/types';

type Project = {
    id: number,
    title: string,
    settings: typeof setting[],
    ownerId: number,
    createdAt: Date,
    updatedAt: Date,
    members: any,
    cashboxes: any,
}

type EntityParams = {
    id: number
    title: string
    balance: DecimalType
    ownerId: number
    settings: any[]
    members: Member[]
    cashboxes: Cashbox[]
}

type UpdateData = {
    title?: string,
    settings?: typeof setting[],
}

const ResponseDetailProject = t.Object({
    id: t.Number(),
    title: t.String(),
    balance: t.Any(),
    ownerId: t.Number(),
    settings: t.Array(setting),
    cashboxes: t.Array(ResponseCashbox),
    members: t.Array(t.Any()),
})

const ResponseProject = t.Object({
    id: t.Number(),
    title: t.String(),
    ownerId: t.Number(),
    settings: t.Array(setting),
})

const ResponseDetailObject = t.Object({
    data: ResponseDetailProject
})

const ResponseObject = t.Object({
    data: ResponseProject
})

const ResponseObjects = t.Object({
    data: t.Array(ResponseProject)
})

export type {
    EntityParams,
    UpdateData,
    Project
}

export {
    ResponseProject,
    ResponseDetailProject,
    ResponseObject,
    ResponseDetailObject,
    ResponseObjects
}