import { container } from "../../modules/containers";
import { InvalidEntity } from "@common/errors";
import { setting } from "@schemas/common";
import { SettingTargets } from "@shared-types/index";

const {projectSettingService, cashboxSettingService, projectSettingGroupService, cashboxSettingGroupService, userSettingService, userSettingGroupService} = container;

const settingServices = {
    project: {
        settingService: projectSettingService,
        groupService: projectSettingGroupService
    },
    cashbox: {
        settingService: cashboxSettingService,
        groupService: cashboxSettingGroupService
    },
    user: {
        settingService: userSettingService,
        groupService: userSettingGroupService
    }
}

export const deriveService = ({params}: {params: {entity: string}}) => {

    const entity = params.entity as SettingTargets;
    const services = settingServices[entity];

    if(!services) throw new InvalidEntity();

    return {services}
}
