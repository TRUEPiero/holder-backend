import {swagger} from '@elysiajs/swagger';

export const swaggerPlugin = swagger({
    documentation: {
        components: {
            securitySchemes: {
                auth: {
                    type: 'apiKey',
                    in: 'cookie',
                    name: 'auth-token',
                    description: 'JWT в cookie',
                }
            }
        },
        security: [
            {
                auth: [],
            },
        ],
        info: {
            title: 'Holder API',
            version: '1.0',
        },
    }
    
})