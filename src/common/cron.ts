import { cron } from "bun";
import { container } from "../../modules/containers";

const { budgetService } = container

export async function initCron() {
    cron('0 0 * * *', async () => {
        // const budgets = await budgetService.getActive()
    })
}
