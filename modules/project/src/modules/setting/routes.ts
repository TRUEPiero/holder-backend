import Elysia, { t } from "elysia";
import { schema } from "./schemas";
import { deriveService } from "@plugins/deriveSettingService";
import { deriveUser } from "@plugins/deriveUser";

export const SettingController = new Elysia({
    prefix: '/:entity/settings/:eid'
})

.derive(deriveUser)
.derive(deriveService)

.get('/', async ({query: {pid}, params: {eid}, user, services: {settingService}}) => {
    const settings = await settingService.getAll(eid, user, pid);
    return {data: settings}
}, schema.getAll)

.get('/groups', async({params: {eid}, user, services: {groupService}}) => {
    const groups = await groupService.getAll(eid, user);
    return {data: groups}
}, schema.groups)

.get('/group/:gid', async({query: {pid}, params: {eid, gid}, user, services: {settingService}}) => {
    const settings = await settingService.getByGroup(eid, gid, user, pid);
    return {data: settings}
}, schema.byGroup)

.patch('/', async ({query: {pid}, params: {eid}, user, body: {settings}, services: {settingService}}) => {
    const updated = await settingService.update(eid, user, settings, pid)
    return {data: updated}
}, schema.update)

