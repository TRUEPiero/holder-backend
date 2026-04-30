import jwt from '@elysiajs/jwt';

export const jwtPlugin = jwt(
    {
        name: 'jwt',
        secret: process.env.JWT_SECRET!
    }
);