import {Context, SessionFlavor} from 'grammy';
import type { ScenesFlavor, ScenesSessionData } from 'grammy-scenes';
import { EntityData, Step } from '../types';

type SessionData = {
    user_id: number
    project_id: number
    cashbox_id: number
    transaction_id: number
    member_id: number
    history: Step[]
    entityData: EntityData
} & ScenesSessionData

export type BotContext = Context & SessionFlavor<SessionData> & ScenesFlavor;