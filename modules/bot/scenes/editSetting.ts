import { Scene } from "grammy-scenes";
import { BotContext } from "../core/context";
import { EntityHandlerFactory } from "../lib/factory";
import { ProjectHandler } from "../entities/project.handler";

const scene = new Scene<BotContext>('editSetting');

scene.step(async(ctx) => {
    const entity = ctx.match![1];
    const settingId = Number(ctx.match![2]);
    const handler = EntityHandlerFactory.create(ctx, entity) as ProjectHandler;

    if(!handler) return;

    ctx.session.entityData = {
        entity,
        settingId,
    }
})

scene.label('confirm_edit').step(async(ctx) => {

})

scene.label('edit_setting').step(async(ctx) => {
    ctx.scene.exit();
})


export default scene;