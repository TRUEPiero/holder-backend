import { TransferService } from "../../project/src/modules/transaction/services/transfer"
import { BotContext } from "../core/context"

interface MoneyTransfer {
    transferService: TransferService

    moneyTransfer(ctx: BotContext): any
    getCorrectCashboxes(ctx: BotContext, data: any): any
    
} 


export {
    MoneyTransfer
} 