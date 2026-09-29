import { container } from "../../../../containers";
import { EventHandler } from "../../../src/interfaces";

const { budgetService } = container;

export class deactivateExpiredEvent implements EventHandler {
    async execute(): Promise<void> {
        await budgetService.deactivateExpired();
    }
}