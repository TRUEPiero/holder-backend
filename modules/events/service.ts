import { EventRepository } from "./repository";

export class EventService {
    constructor (
        private repo: EventRepository
    ) {}

    async getActive() {
        const events = await this.repo.findActive();
        return events;
    }
}