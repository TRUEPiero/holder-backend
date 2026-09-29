import { DecimalType } from "@shared-types/index";
import { UserEntity } from "../../../../../user/src/modules/user/entities/User";
import { BotService } from "../../../../../bot/services/bot.service";
import { CashboxEntity } from "../../cashbox/entities/Cashbox";
import { i18n } from "../../../../../bot/core/i18n";

export class NotificationService {
    constructor () {}

    public async notifyAboutNegativeBalance(user: UserEntity, cashbox: CashboxEntity) {
        const bot = BotService.getInstance();

        const msg = i18n.t(user.getLocale(), 'notification-negative-balance', {
            cashboxTitle: cashbox.getTitle(),
            balance: cashbox.getBalance().toString()
        });

        await bot.sendMessage(user.getTelegramId(), msg, {
            parseMode: 'HTML'
        });
    }

    public async notifyAboutLessAmountBalance(user: UserEntity, cashbox: CashboxEntity, settingAmount: DecimalType) {
        const bot = BotService.getInstance();
        const msg = i18n.t(user.getLocale(), 'notification-less-amount-balance', {
            cashboxTitle: cashbox.getTitle(),
            settingAmount: settingAmount.toString(),
            balance: cashbox.getBalance().toString()
        });

        await bot.sendMessage(user.getTelegramId(), msg, {
            parseMode: 'HTML'
        });
    }
}