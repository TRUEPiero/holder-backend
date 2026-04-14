import Elysia, { t } from "elysia";
import { container } from "../../../../containers";

const {projectSettingService} = container;

export const ProjectSettingsController = new Elysia({
    prefix: '/project/:pid/settings'
})

.get('/groups', async({params: {pid}}) => {

}, {
    params: t.Object({
        pid: t.Number(),
    })  
})

.get('/groups/:gid', async({params: {pid, gid}}) => {
    return await projectSettingService.getByGroup(pid, gid)
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