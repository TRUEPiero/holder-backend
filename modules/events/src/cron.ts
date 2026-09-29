import { cron } from "bun";
import { container } from "../../containers";
import { HandlersRegister } from "./register";
import { EventHandler } from "./interfaces";

const { eventService } = container;

const handlers = new HandlersRegister();

export async function initCron() {

    try {
        const events = await eventService.getActive();
        let registed = 0;
        
        for(const event of events) {
            const schelude = event.getSchelude();
            const key = event.getKey();
            const handler = handlers.get(key);

            if(!handler) {
                console.log(`[Cron] event: ${event.getKey} skipped`)
                continue;
            }

            await register(schelude, handler);
            registed++;
        }

        console.log(`[Cron] trigged ${registed} event`);

    } catch (error) {
         console.error('[Cron] error:', error);
    }
}

export async function register(schelude: string, handler: EventHandler) {
    cron(schelude, () => handler.execute());
}
