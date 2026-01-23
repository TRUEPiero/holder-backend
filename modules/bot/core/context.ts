import {Context, SessionFlavor} from 'grammy';

type SessionData = {

}

export type BotContext = Context & SessionFlavor<SessionData> 