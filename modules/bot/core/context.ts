import {Context, SessionFlavor} from 'grammy';

type SessionData = {
    chat_id: number;
    user_id: number;
    project_id: number;
    cashbox_id: number;
}

export type BotContext = Context & SessionFlavor<SessionData>
