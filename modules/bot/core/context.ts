import {Context, SessionFlavor} from 'grammy';
import type { ScenesFlavor, ScenesSessionData } from 'grammy-scenes';

type SessionData = {
    user_id: number
    project_id: number
    cashbox_id: number
    transaction_id: number
    history: any[]
    userData: any
    entityData: any
} & ScenesSessionData

export type BotContext = Context & SessionFlavor<SessionData> & ScenesFlavor;