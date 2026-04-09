import { ProjectService } from "../project/services";
import { SettingRepository } from "./repository";

export class SettingService {
    constructor(
        private repo: SettingRepository,
        private projectService: ProjectService
    ) {}

    public async getDefaultSetings() {
        const settings = await this.repo.findAll();
        return settings;
    }

    public async getProjectSetting(projectId: number) {
        const project = await this.projectService.checjProjectExist(projectId);
        const projectSettings = project.getSettings();
    }
}