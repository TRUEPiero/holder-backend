import { container } from "../../../../containers";
import { InvalidEntity } from "./errors";
import { SettingTargets } from "./types";

const {projectSettingService, cashboxSettingService} = container;

const services = {
    project: projectSettingService,
    cashbox: cashboxSettingService,
}

export const deriveService = ({query}: any) => {
    const entity = query.entity as SettingTargets;
    const service = services[entity];

    if(!service) throw new InvalidEntity();

    return {service}
}
