import { CashboxService } from "../cashbox/services";
import { CashboxSettingEntity } from "./entities/Setting";
import { CashboxSettingsRepository } from "./repositories";
import { Setting } from "./types";

export class CashboxSettingsService {
    constructor(
        private repo: CashboxSettingsRepository,
        private cashboxService: CashboxService
    ) {}

    public async getAll(cashboxId: number) {
        const allSetting = await this.repo.findByFilter({});

        const formattedSettings = await this.compareWithCashboxSettings(cashboxId, allSetting);
        return formattedSettings;
    }

    public async getByGroup(cashboxId: number, groupId: number) {
        const groupSettings = await this.repo.findByGroup(groupId);

        const formattedSettings = await this.compareWithCashboxSettings(cashboxId, groupSettings);
        return formattedSettings;    
    }

    public async getForTelegram(cashboxId: number) {
        const groupSettings = await this.repo.findByFilter({telegram: true});

        const formattedSettings = await this.compareWithCashboxSettings(cashboxId, groupSettings);
        return formattedSettings; 
    }

    private async compareWithCashboxSettings(cashboxId: number, defaultSettings: CashboxSettingEntity[]) {
        const cashbox = await this.cashboxService.getById(cashboxId);
        const projectSettings = cashbox.getSettings();
        const copied = defaultSettings;

        copied.forEach(setting => {
            const projectSetting = projectSettings.find((p: Setting) => p.code === setting.code);
            if(!projectSetting) return;

            setting.value = projectSetting.value;    
        })

        return copied;
    }
}