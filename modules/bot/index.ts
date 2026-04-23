import { startBot } from "./core/bot";

export class BotController {

    static async start() {
        try {
            await startBot();
            console.log('[Bot] started');
        } catch (error) {
            console.error(`[Bot] Error while starting ${error}`)
        }
    }
}
