import Elysia from "elysia";
import { schema } from "./schemas";
import { deriveService } from "./deriveService";

export const SettingController = new Elysia({
    prefix: '/settings/:eid'
})

.derive(deriveService)

.get('/', async ({params: {eid}, service}) => {
    const settings = await service.getAll(eid);
    return {data: settings}
}, schema.getAll)

.get('/group/:gid', async({params: {eid, gid}, service}) => {
    const settings = await service.getByGroup(eid, gid);
    return {data: settings}
}, schema.byGroup)