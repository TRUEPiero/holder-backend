import { container } from "../../modules/containers";
import { InvalidEntity } from "@common/errors";
import { SettingTargets } from "@shared-types/index";

const {projectSettingService, cashboxSettingService, projectSettingGroupService, cashboxSettingGroupService} = container;

const settingServices = {
    project: {
        settingService: projectSettingService,
        groupService: projectSettingGroupService
    },
    cashbox: {
        settingService: cashboxSettingService,
        groupService: cashboxSettingGroupService
    },
}

export const deriveService = ({params}: {params: {entity: string}}) => {

    const entity = params.entity as SettingTargets;
    const services = settingServices[entity];

    if(!services) throw new InvalidEntity();

    return {services}
}
