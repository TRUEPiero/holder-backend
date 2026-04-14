import { ScenesComposer } from "grammy-scenes";
import type { BotContext } from "../core/context";
import createScene from './createItem';
import deleteScene from './deteleItem';

export const scenes = new ScenesComposer<BotContext>();
scenes.scene(createScene);
scenes.scene(deleteScene);
