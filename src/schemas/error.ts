import { t } from 'elysia';

export const errorSchema = {
  400: t.Object({
    error: t.String()
  }),
  401: t.Object({
    error: t.String()
  }),
  404: t.Object({
    error: t.String()
  }),
  500: t.Object({
    error: t.String()
  })
};