import { ScenesComposer } from "grammy-scenes";
import type { BotContext } from "../core/context";
import { scene as registerScene } from "./registration";

export const scenes = new ScenesComposer<BotContext>();
scenes.scene(registerScene)
