import { BotContext } from "../core/context";

function replyOrEdit(ctx: BotContext, isCommand: boolean) {
    return isCommand 
        ? ctx.reply.bind(ctx) 
        : ctx.editMessageText.bind(ctx);
} 

export {
    replyOrEdit
}