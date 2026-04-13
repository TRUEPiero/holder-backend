import { ProjectService } from "../../project/services";
import { SettingRepository } from "../repositories/setting";
import { Setting } from "../types";

export class SettingService {
    constructor(
        private repo: SettingRepository,
        private projectService: ProjectService
    ) {}

    public async getGroupSettings(projectId: number, groupId: number) {
        const project = await this.projectService.getById(projectId);

        const projectSettings = project.getSettings();
        const groupSetting = await this.repo.findByGroup(groupId);

        groupSetting.forEach(setting => {
            const projectSetting = projectSettings.find((p: Setting) => p.code === setting.code);
            if(!projectSetting) return;

            setting.value = projectSetting.value;    
        })

        return groupSetting;
    }

    private async getDefaultSetings() {
        const settings = await this.repo.findAll();
        return settings;
    }
}