import { ScenesComposer } from "grammy-scenes";
import type { BotContext } from "../core/context";
import createScene from './itemCreate';
import renameScene from './itemRename';
import deleteScene from './itemDelete';
import transferScene from './moneyTransfer';
import inviteScene from './inviteMember';
import editSettingScene from './settingEdit';

export const scenes = new ScenesComposer<BotContext>();
scenes.scene(createScene);
scenes.scene(deleteScene);
scenes.scene(transferScene);
scenes.scene(renameScene);
scenes.scene(inviteScene);
scenes.scene(editSettingScene);

