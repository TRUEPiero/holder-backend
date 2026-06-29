import { t } from 'elysia';
import { Cashbox, ResponseCashbox } from '../cashbox/types';
import { setting } from '@schemas/common';
import { DecimalType } from '@shared-types/index';
import { Member } from '../member/types';
import { ProjectEntity } from './entities/Project';

type Project = {
    id: number,
    title: string,
    balance: DecimalType
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

type PaginationResult = {
    items: ProjectEntity[],
    pagination: {
        currentPage: any;
        totalPages?: number;
        totalItems: any;
        hasNextPage?: boolean;
    };
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
    balance: t.Any(),
})

const ResponseTags = t.Object({
    data: t.Array(t.Any())
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

const ResponseWithPagination = t.Object({
    items: t.Array(ResponseProject),
    pagination: t.Object({
        currentPage: t.Number(),
        totalPages: t.Number(),
        totalItems: t.Number(),
        hasNextPage: t.Boolean()
    })
})

export type {
    EntityParams,
    UpdateData,
    Project,
    PaginationResult
}

export {
    ResponseProject,
    ResponseDetailProject,
    ResponseObject,
    ResponseDetailObject,
    ResponseObjects,
    ResponseWithPagination
}