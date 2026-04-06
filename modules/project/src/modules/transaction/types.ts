import {t} from 'elysia';

export const ResponseTransaction = t.Object({

})

export const ResponseObject = t.Record(
    t.String(), t.Nullable(ResponseTransaction)
)

export const ResponseObjects = t.Record(
    t.String(), t.Array(ResponseTransaction)
)