import { ProjectService } from "../../project/services";
import { SettingEntity } from "../entities/Setting";
import { SettingRepository } from "../repositories/setting";
import { Setting } from "../types";

export class SettingService {
    constructor(
        private repo: SettingRepository,
        private projectService: ProjectService
    ) {}

    public async getAll(projectId: number) {
        const allSetting = await this.repo.findByFilter({});

        const formattedSettings = await this.compareWithProjectSettings(projectId, allSetting);
        return formattedSettings;
    }

    public async getByGroup(projectId: number, groupId: number) {
        const groupSettings = await this.repo.findByGroup(groupId);

        const formattedSettings = await this.compareWithProjectSettings(projectId, groupSettings);
        return formattedSettings;    
    }

    public async getForTelegram(projectId: number) {
        const groupSettings = await this.repo.findByFilter({telegram: true});

        const formattedSettings = await this.compareWithProjectSettings(projectId, groupSettings);
        return formattedSettings; 
    }

    private async compareWithProjectSettings(projectId: number, defaultSettings: SettingEntity[]) {
        const project = await this.projectService.getById(projectId);
        const projectSettings = project.getSettings();
        const copied = defaultSettings;

        copied.forEach(setting => {
            const projectSetting = projectSettings.find((p: Setting) => p.code === setting.code);
            if(!projectSetting) return;

            setting.value = projectSetting.value;    
        })

        return copied;
    }
}