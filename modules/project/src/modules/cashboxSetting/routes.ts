import Elysia from "elysia";

const CashboxSettingsController = new Elysia({
    prefix: '/cashbox/:cid/settings'
})

.get('/', async({}) => {
    
})