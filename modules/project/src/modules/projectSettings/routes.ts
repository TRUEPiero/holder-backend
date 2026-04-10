import Elysia, { t } from "elysia";
import { SettingService } from "./service";
import { SettingRepository } from "./repository";
import { DirectoryService } from "@shared/DirectoryService";
import { ProjectRepository } from "../project/repository";
import { ProjectService } from "../project/services";

const projectBase = new DirectoryService<'project'>('project', ['owner']);
const projectRepo = new ProjectRepository(projectBase);
const projectService = new ProjectService(projectRepo);

const settingBase = new DirectoryService<'projectSetting'>('projectSetting', ['values'])
const settingRepo = new SettingRepository(settingBase);
const settingService = new SettingService(settingRepo, projectService);

export const ProjectSettingsController = new Elysia({
    prefix: '/project/:pid/setting'
})

.get('/', async({params: {pid}}) => {
    return await settingService.getProjectSetting(pid);
}, {
    params: t.Object({
        pid: t.Number()
    })
})
.patch('/', async({}) => {

})
.patch("/reset", async({}) => {
    
})