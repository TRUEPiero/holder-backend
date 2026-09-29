import { DirectoryService } from "@services/DirectoryService";
import { Event } from "./entity";

export class EventRepository {
    constructor(
        private base: DirectoryService<'events'>
    ) {}

    async findActive(): Promise<Event[]> {

        const filter = {
            active: true
        };
        
        const order = {
            priority: 'asc'
        }

        const data = await this.base.getByFields(filter, {}, order);
        return data.map(i => new Event(i));
    }
}