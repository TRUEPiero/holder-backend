import db from "@common/prisma";
import fs from 'fs';

type SettingType = 'enum' |'string' |'number' |'boolean' |'float'

type Setting = {
    code: string
    type: SettingType
    values: any[]
    value: any
    title: string
    description: String
    isDisable: boolean
    isRequired: boolean
    groupId: number
}

type Group = {
    code: string
    title: string
    description: string
    settings: Setting[]
}

function getJsonObject() {
    const filePath = `./modules/project/migrations/json/project_setting.json`;
    const content = JSON.parse(fs.readFileSync(filePath, 'utf-8'));

    return content
}

async function main() {
    const groups: Group[] = getJsonObject();

    for(const group of groups) {
        const createdGroup = await db.settingGroup.create({
            data: {
                code: group.code,
                title: group.title,
                description: group.description
            }
        })

        for(const setting of group.settings) {
            const createdSetting = await db.projectSetting.create({
                data: {
                    code: setting.code,
                    title: setting.title,
                    type: setting.type,
                    group: {
                        connect: {
                            id: createdGroup.id
                        }
                    },
                    isDisable: setting.isDisable,
                    isRequired: setting.isRequired,
                    value: setting.value,
                    values: setting.values
                }
            })
        }
    }
}

await main();