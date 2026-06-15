import Elysia from "elysia";
import { schema } from "./schemas";
import { deriveService } from "./services/deriveSettingService";
import { deriveUser } from "@plugins/deriveUser";

export const SettingController = new Elysia({
    prefix: '/:entity/settings/:eid'
})

.derive(deriveUser)
.derive(deriveService)

.get('/', async ({params: {eid}, user, services: {settingService}}) => {
    const settings = await settingService.getAll(eid, user);
    return {data: settings}
}, schema.getAll)

.get('/groups', async({params: {eid}, user, services: {groupService}}) => {
    const groups = await groupService.getAll(eid, user);
    return {data: groups}
}, schema.groups)

.get('/group/:gid', async({params: {eid, gid}, user, services: {settingService}}) => {
    const settings = await settingService.getByGroup(eid, gid, user);
    return {data: settings}
}, schema.byGroup)

