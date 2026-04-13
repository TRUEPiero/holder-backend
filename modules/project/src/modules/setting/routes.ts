import Elysia, { t } from "elysia";
import { container } from "../../../../containers";

const {settingService} = container;

export const ProjectSettingsController = new Elysia({
    prefix: '/project/:pid/setting'
})

.get('/groups', async({params: {pid}}) => {

}, {
    params: t.Object({
        pid: t.Number(),
    })  
})

.get('/groups/:gid', async({params: {pid, gid}}) => {
    return await settingService.getGroupSettings(pid, gid)
}, {
    params: t.Object({
        pid: t.Number(),
        gid: t.Number(),
    })  
})

.patch('/', async({}) => {

})
.patch("/reset", async({}) => {
    
})