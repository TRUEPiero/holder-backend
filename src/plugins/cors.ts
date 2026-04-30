import { cors } from '@elysiajs/cors'

export const corsPlugin = cors({
    origin: process.env.FRONTEND_ORIGIN,
    credentials: true
});
