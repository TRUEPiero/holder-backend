import { startBot } from "./core/bot";

await startBot()

export class BotController {

    static async start() {
        try {
            await startBot();
            console.log('🤖 Bot has be started');
        } catch (error) {
            console.error(`Error while starting bot ${error}`)
        }
    }
}