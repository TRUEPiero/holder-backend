import {t} from 'elysia';

export type Project = {
    id: number,
    title: string,
    settings: any,
    ownerId: number,
    createdAt: Date,
    updatedAt: Date,
    members: any,
    cashboxes: any,
}

export type UpdateData = {
    title?: string,
    settings?: Setting[],
}

type Setting = {
    code: string,
    value: any
} 

export const ResponseProject = t.Any()

export const ResponseObject = t.Record(
    t.String(), ResponseProject
)

export const ResponseObjects = t.Record(
    t.String(), t.Array(ResponseObject)
)