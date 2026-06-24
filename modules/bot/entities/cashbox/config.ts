import { DecimalClass } from "@shared-types/index";
import { EntityConfig } from "../../interfaces/entity.config";

const cashboxConfig: EntityConfig<any> = {   
    fields: [
      { key: "title", title: "Счет", visible: true },
      {
        key: "balance", 
        title: "Баланс", 
        visible: true, 
        formatter: (value: number | string) => new DecimalClass(value).toFixed(2) 
      },
    ],
    
    getTitleKey(item) {
        return item.getTitle()
    },
    getId(ctx) {
        return ctx.session.cashbox_id
    },
    getFilter(ctx) {
        return { projectId: ctx.session.project_id };
    },
}   

export {
    cashboxConfig
}