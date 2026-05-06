import { MemberRoles } from "../../types";
import { EntityConfig } from "../../interfaces/entity.config";

const memberConfig: EntityConfig<any> = {
    fields: [
        { key: "user.name", title: "Имя", visible: true },
        { key: "role", title: "Роль", visible: true, formatter: (value: MemberRoles) => value === 'editor' ? "Редактор" : "Зритель"},
        { key: "user.telegram", title: "TG", visible: true, formatter: (value: string) => `@${value}` }
    ],
    getFilter(ctx) {
        return { projectId: ctx.session.project_id, isDeleted: false };
    },
    getTitleKey(item) {
        return `${item.user!.name} (${item.role})`
    },
    getId(ctx) {
        return ctx.session.member_id;
    },
}

export {
    memberConfig
}