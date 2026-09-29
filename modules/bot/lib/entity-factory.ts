import { EntityController } from "../entities/EntityController";
import { cashboxConfig } from "../entities/cashbox/config";
import { cashboxKeyboard } from "../entities/cashbox/keyboard";
import { cashboxServiceTg } from "../entities/cashbox/service";
import { memberConfig } from "../entities/member/config";
import { memberServiceTg } from "../entities/member/service";
import { memberKeyboard } from "../entities/member/keyboard";
import { projectConfig } from "../entities/project/config";
import { projectKeyboard } from "../entities/project/keyboard";
import { projectServiceTg } from "../entities/project/service";
import { transactionConfig } from "../entities/transaction/config";
import { transactionKeyboard } from "../entities/transaction/keyboard";
import { transactionServiveTg } from "../entities/transaction/service";
import { userServiceTg } from "../entities/user/service";
import { EntityType } from "../types";
import { userConfig } from "../entities/user/config";
import { userKeyboard } from "../entities/user/keyboard";

const config = {
    project: {
        config: projectConfig,
        service: projectServiceTg,
        keyboard: projectKeyboard
    },
    cashbox: {
        config: cashboxConfig,
        service: cashboxServiceTg,
        keyboard: cashboxKeyboard
    },
    transaction: {
        config: transactionConfig,
        service: transactionServiveTg,
        keyboard: transactionKeyboard
    },
    member: {
        config: memberConfig,
        service: memberServiceTg,
        keyboard: memberKeyboard
    },
    user: {
        config: userConfig,
        service: userServiceTg,
        keyboard: userKeyboard,
    }
}

const services = {
    project: projectServiceTg,
    cashbox: cashboxServiceTg,
    transaction: transactionServiveTg,
    member: memberServiceTg
}

class EntityControllerFactory {
    static create(entity: EntityType) {
        const params = config[entity];
        return new EntityController(params);
    }
}

class EntityServiceFactory {
    static create(entity: EntityType) {
        return services[entity];
    }
}

export {
    EntityControllerFactory,
    EntityServiceFactory
}