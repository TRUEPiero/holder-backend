import { cors } from '@elysiajs/cors'

export const corsPlugin = cors({
    origin: true,
    credentials: true
});
