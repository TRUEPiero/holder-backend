import { EventHandler } from "./interfaces";
import { deactivateExpiredEvent } from "./actions/budget/deactivateExpired";

export class HandlersRegister {

    private handlers = new Map<string, EventHandler>();

    constructor() {
        this.register([
            {key: 'budget.deactivateExpired',  handler: new deactivateExpiredEvent()},
        ])
    }
    
    register(events: {key: string, handler: EventHandler}[]) {
        for(const event of events) {
            this.handlers.set(event.key, event.handler);
        }
    }

    get(key: string): EventHandler | undefined {
        return this.handlers.get(key);
    }
}