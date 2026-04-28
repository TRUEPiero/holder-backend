import Elysia from "elysia";
import { schema } from "./schemas";
import { deriveService } from "./deriveService";
import { deriveUser } from "@plugins/deriveUser";

export const SettingController = new Elysia({
    prefix: '/settings/:eid'
})

.derive(deriveUser)
.derive(deriveService)

.get('/', async ({params: {eid}, user, service}) => {
    const settings = await service.getAll(eid, user);
    return {data: settings}
}, schema.getAll)

.get('/group/:gid', async({params: {eid, gid}, user, service}) => {
    const settings = await service.getByGroup(eid, gid, user);
    return {data: settings}
}, schema.byGroup)