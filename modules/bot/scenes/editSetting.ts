import { Scene } from "grammy-scenes";
import { BotContext } from "../core/context";
import { EntityType } from "../types";

const scene = new Scene<BotContext>('editSetting');

scene.step(async(ctx) => {
    const entity = ctx.match![1] as EntityType;
    const entityId = Number(ctx.match![2]);

    ctx.session.entityData = {
        entity,
        entityId,
    }
})

scene.label('confirm_edit').step(async(ctx) => {

})

scene.label('edit_setting').step(async(ctx) => {
    ctx.scene.exit();
})


export default scene;