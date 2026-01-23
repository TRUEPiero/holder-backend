import { BotError, Context, GrammyError, HttpError } from "grammy";

export function errorHandler(error: BotError<Context>) {
    const ctx = error.ctx;
    console.error(`Error while handling update ${ctx.update.update_id}:`); 
    const e = error.error;
    if (e instanceof GrammyError) {
        console.error('Error in request:', e.description);
    } else if (e instanceof HttpError) { 
        console.error('Could not contact Telegram:', e);
    } else {
        console.error('Unknown error:', e);
    }
}