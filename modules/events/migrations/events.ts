import db from "@common/prisma";
import fs from 'fs';
import { HandlersRegister } from "../register";
import { register } from "../cron";

type Event = {
    active: boolean,
    schelude: string,
    entity: string,
    action: string,
    priority: number
}

function getJsonObject(): Event[] {
    const filePath = `./modules/events/migrations/json/events.json`;
    const content = JSON.parse(fs.readFileSync(filePath, 'utf-8'));

    return content
}

export async function main() {
    const events = getJsonObject();

    const handlres = new HandlersRegister();

    for(const event of events) {
        const created = await db.events.create({
            data: event
        })

        if(!created.active) continue;

        const handler = handlres.get(`${created.entity}.${created.action}`);
        if(!handler) continue;

        register(created.schelude, handler)
    }
}

await main();