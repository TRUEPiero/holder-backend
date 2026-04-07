import {t} from 'elysia';

export type Project = {
    id: number,
    title: string,
    default: boolean,
    parameters: any,
    ownerId: number,
    createdAt: Date,
    updatedAt: Date,
    members: any,
    cashboxes: any,
}

export const ResponseProject = t.Any()

export const ResponseObject = t.Record(
    t.String(), ResponseProject
)

export const ResponseObjects = t.Record(
    t.String(), t.Array(ResponseObject)
)