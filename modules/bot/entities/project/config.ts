import { EntityConfig } from "../../interfaces/entity.config";

const projectConfig: EntityConfig<any> = {   
    fields: [
        { key: "title", title: "Проект", visible: true },
    ],
    
    getTitleKey(item) {
        return item.getTitle
    },
    getId(ctx) {
        return ctx.session.project_id
    },
    getFilter(ctx) {
      const userId = ctx.session.user_id;

        return {
            OR: [
                {ownerId: userId},
                {members: {
                    some: {
                        userId
                    }
                }}
            ]
        };  
    },
}   

export {
    projectConfig
}