import {t} from 'elysia';
import { ResponseCashbox } from '../cashbox/types';
import { ResponseMember } from '../member/types';
import { setting } from '@schemas/common';

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

type UpdateData = {
    title?: string,
    settings?: typeof setting[],
}

const ResponseProject = t.Object({
    id: t.Number(),
    title: t.String(),
    ownerId: t.Number(),
    settings: t.Array(setting),
    cashboxes: t.Array(ResponseCashbox),
    members: t.Array(t.Any()),
})

const ResponseObject = t.Object({
    data: ResponseProject
})

const ResponseObjects = t.Object({
    data: t.Array(ResponseProject)
})

export type {
    UpdateData,
    Project
}

export {
    ResponseProject,
    ResponseObject,
    ResponseObjects
}