import { DecimalType } from "@shared-types/index";
import { UserEntity } from "../../../../auth/src/modules/user/entities/User";
import { BotService } from "../../../../bot/services/bot.service";
import { CashboxEntity } from "../cashbox/entities/Cashbox";

export class NotificationService {
    constructor () {}

    public async notifyAboutNegativeBalance(user: UserEntity, cashbox: CashboxEntity) {
        const bot = BotService.getInstance();
        const msg = `Баланс счета: "${cashbox.getTitle()}" меньше 0 <br/> Текущий баланс: ${cashbox.getBalance()}`;

        await bot.sendMessage(user.getTelegramId(), msg, {
            parseMode: 'HTML'
        });
    }

    public async notifyAboutLessAmountBalance(user: UserEntity, cashbox: CashboxEntity, settingAmount: DecimalType) {
        const bot = BotService.getInstance();
        const msg = `Уведоление! Баланс счета "${cashbox.getTitle()}" опустился ниже ${settingAmount} <br/> Текущий баланс: ${cashbox.getBalance()}`;

        await bot.sendMessage(user.getTelegramId(), msg);
    }
}