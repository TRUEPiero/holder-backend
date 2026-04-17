import { Scene } from "grammy-scenes";
import { BotContext } from "../core/context";
import { EntityHandlerFactory } from "../lib/factory";

const scene = new Scene<BotContext>('editSetting');

scene.step(async(ctx) => {
    const entity = ctx.match![1];
    const settingId = ctx.match![2];
    const handler = EntityHandlerFactory.create(ctx, entity);
    if(!handler) return;

    console.log(entity, settingId, handler)
})



export default scene;