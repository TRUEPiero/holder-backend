import { startBot } from "./core/bot";

try {
    await startBot();
    console.log('Bot has be started');
} catch (error) {
    console.error(`Error while starting bot ${error}`)
}