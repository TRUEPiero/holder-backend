import { EventHandler } from "../../interfaces";


export class testEvent implements EventHandler {
    async execute(): Promise<void> {
        console.log('test');
    }
}