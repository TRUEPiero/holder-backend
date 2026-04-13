import { ScenesComposer } from "grammy-scenes";
import type { BotContext } from "../core/context";
import createScene from './createItem';

export const scenes = new ScenesComposer<BotContext>();
scenes.scene(createScene);
