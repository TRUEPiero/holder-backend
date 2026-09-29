import { Setting } from "@schemas/common"

export abstract class Entity {
    protected id: number

    constructor(params: any) {
        this.id = params.id
    }

    getId() {
        return this.id
    }

    abstract response(): any
}

export abstract class SettingTarget extends Entity {
    protected settings: Setting[]

    constructor(params: any) {
        super(params)
        this.settings = params.settings
    }

    getSettings(): Setting[] {
        return this.settings
    }

    getSettingByCode(code: string): Setting | undefined {
        return this.settings.find(setting => setting.code === code)
    }

    formatSettings() {
        if (!this.settings) return [];

        return this.settings.map((setting: any) => ({
            settingId: setting.settingId,
            code: setting.setting.code,
            value: setting.value
        }))
    }
}