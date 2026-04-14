type SettingType  = 'enum' | 'string' | 'number' | 'boolean';

export type Setting = {
    id: number,
    code: string,
    description: string
    groupId: number
    type: SettingType
    values: any[]
}