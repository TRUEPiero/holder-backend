import { BotContext } from "../core/context"
import { container } from "../../containers"

const { transferService } = container

interface MoneyTransfer {
    transferService: typeof transferService

    moneyTransfer(ctx: BotContext): any
    getCorrectCashboxes(ctx: BotContext, data: any): any
    
} 


export {
    MoneyTransfer
} 