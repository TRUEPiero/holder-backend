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

    settings.forEach(sett => {
        if(sett.type === 'boolean') {
            res += `${sett.title}: ${sett.value ? 'on' : 'off'}` + '\n';
        } else {
            res += `${sett.title}: ${sett.value}` + '\n'
        }
    })

    return res;
}

function getValueByPath(obj: any, path: string) {
    return path.split('.').reduce((acc, key) => acc?.[key], obj);
}

export {
    buildSettingsMessage,
    buildItemMessage,
}