import {t} from 'elysia';

export const ResponseProject = t.Any()

export const ResponseObject = t.Record(
    t.String(), ResponseProject
)

export const ResponseObjects = t.Record(
    t.String(), t.Array(ResponseObject)
)