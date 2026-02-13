import { Scene } from "grammy-scenes";
import type { BotContext } from "../core/context";
import { MenuKeyboard } from "../keyboards/menu";
import { UserService } from "../../auth/services/user";

const userService = new UserService();

export const scene = new Scene<BotContext>('register');


