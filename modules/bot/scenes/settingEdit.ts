import { Scene } from "grammy-scenes";
import { BotContext } from "../core/context";
import { EntityServiceFactory } from "../lib/entity-factory";
import { EntitySettingsOwner } from "../interfaces/owner-settings";
import { render } from "../lib/render";
import { Step } from "../types";
import { SettingEntity } from "../../project/src/modules/settings/entities/Setting";

const scene = new Scene<BotContext>('editSetting');

scene.step(async(ctx) => {
    const entity = ctx.match![1] as 'project' | 'cashbox';
    const settingId = Number(ctx.match![2]);

    const service = EntityServiceFactory.create(entity) as EntitySettingsOwner;

    const setting = await service.getSetting(ctx, settingId);
    const settingType = setting.getType();

    ctx.session.entityData = {
        entity,
        settingId,
        setting
    }
   
    ctx.scene.goto(`edit_${settingType}`);
    return;
})

scene.label('edit_string').step(async(ctx) => {
    const setting = ctx.session.entityData.setting as SettingEntity;

    await ctx.editMessageText(`Введите новое значение для ${setting.title}:`);
})

scene.wait('wait_string').on(['message:text', 'callback_query'], async(ctx) => {
    const choice = ctx.callbackQuery?.data;
    if(choice && choice === 'create_cancel') {
        ctx.answerCallbackQuery();
        await render(ctx, {
            type: 'page',
            entity: ctx.session.entityData.entity,
            id: 1
        });
        ctx.scene.exit();
        return;
    }

    const value = ctx.message?.text;
    if(!value) {
        scene.goto('edit_string')
    }  
    
    ctx.session.entityData.value = value;
    ctx.scene.goto('confirm_edit');
    return;
})

scene.label('edit_boolean').step(async(ctx) => {})
scene.label('edit_number').step(async(ctx) => {})


scene.label('confirm_edit').step(async(ctx) => {
    const entity = ctx.session.entityData.entity;

    const service = EntityServiceFactory.create(entity) as EntitySettingsOwner;

    try{
        const updated = await service.updateSetting(ctx);
        if(!updated) throw new Error("SETTING_NOT_UPDATED");

        const step: Step = {
            entity: entity,
            type: 'item',
            id: updated.id
        }

        await render(ctx, step, true);
    }catch(err) {
        console.error('Error while update setting:', JSON.stringify(err));

        await ctx.reply('Ошибка при обновлении. Обратитесь в сл. под.');
    }

    ctx.scene.exit();
})

export default scene;