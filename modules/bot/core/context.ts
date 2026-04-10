import {Context, LazySessionFlavor, SessionFlavor} from 'grammy';
import type { ScenesFlavor, ScenesSessionData } from 'grammy-scenes';

type SessionData = {
    user_id: number;
    project_id: number;
    cashbox_id: number;
    history: any;
    userData: any
} & ScenesSessionData

export type BotContext = Context & SessionFlavor<SessionData> & ScenesFlavor;