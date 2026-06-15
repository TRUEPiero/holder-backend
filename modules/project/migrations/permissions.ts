import db from "@common/prisma";
import { PermissionsEntity, PermissionSetting } from "@prisma/client";
import fs from 'fs';

function getJsonObject(): {
    permissions: string[],
    roles: Record<string, string[]>
} {
    const filePath = `./modules/project/migrations/json/permissions.json`;
    const content = JSON.parse(fs.readFileSync(filePath, 'utf-8'));

    return content
}

async function main() {
    const object = getJsonObject();
    const permissions = object.permissions;
    const roles = object.roles;

    await db.permission.createMany({
        data: permissions.map(i => {
            const [entity, setting] = i.split(':');

            return {
                entity: entity as PermissionsEntity,
                setting: setting as PermissionSetting
            }
        })
    })

    for (const [name, perms] of Object.entries(roles)) {
        await db.memberRole.create({
            data: {
                name,
                isDefault: name === 'viewer',
                permissions: {
                    create: perms.map(perm => {
                        const [entity, setting] = perm.split(':');

                        return {
                            permission: {
                                connect: {
                                    entity_setting: {
                                        entity: entity as PermissionsEntity,
                                        setting: setting as PermissionSetting
                                    }
                                }
                            }
                        }
                    })
                }
            }
        })
    }
}

await main();