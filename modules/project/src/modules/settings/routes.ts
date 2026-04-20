import Elysia from "elysia";
import { container } from "../../../../containers";
import { schema } from "./schemas";

const {projectSettingService, cashboxSettingService} = container;

export const SettingController = new Elysia({
    prefix: '/settings'
})
.get('/', async ({query: entity}) => {
      
}, schema.getAll)