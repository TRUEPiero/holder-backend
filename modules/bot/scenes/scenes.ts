import { ScenesComposer } from "grammy-scenes";
import type { BotContext } from "../core/context";
import createScene from './createItem';
import renameScene from './renameItem';
import deleteScene from './deteleItem';
import transferScene from './moneyTransfer';
import inviteScene from './inviteMember';
import editSetting from './editSetting';

export const scenes = new ScenesComposer<BotContext>();
scenes.scene(createScene);
scenes.scene(deleteScene);
scenes.scene(transferScene);
scenes.scene(renameScene);
scenes.scene(inviteScene);
scenes.scene(editSetting);

