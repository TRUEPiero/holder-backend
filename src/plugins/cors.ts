import { cors } from '@elysiajs/cors'

export const corsPlugin = cors({
    origin: 'http://localhost:3050',
    credentials: true
});
