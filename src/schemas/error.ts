import { t } from 'elysia';

const errorSchema = {
  400: t.Object({
    code: t.String(),
    description: t.String()
  }),
  401: t.Object({
    code: t.String(),
    description: t.String()
  }),
  403: t.Object({
    code: t.String(),
    description: t.String()
  }),
  404: t.Object({
    code: t.String(),
    description: t.String()
  }),
  500: t.Object({
    code: t.String(),
    description: t.String()
  })
};

export {
  errorSchema,
}