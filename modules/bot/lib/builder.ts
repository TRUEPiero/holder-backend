function buildItemMessage(entity: any, fields: any[]): string {
    return fields
        .filter(f => f.visible)
        .map(f => {
            const rawValue = getValueByPath(entity, f.key as string);
            const value = f.formatter
                ? f.formatter(rawValue, entity)
                : rawValue;

            return `${f.title}: ${value}`;
        })
        .join("\n");
}

function buildSettingsMessage(settings: any[]) {
    let res = `Настройки\n`

    res += settings
        .filter(s => s.type === 'boolean')
        .map(s => `${s.title}: ${s.value ? 'on' : 'off'}`)
        .join("\n")

    return res;
}

function getValueByPath(obj: any, path: string) {
    return path.split('.').reduce((acc, key) => acc?.[key], obj);
}

export {
    buildSettingsMessage,
    buildItemMessage,
}