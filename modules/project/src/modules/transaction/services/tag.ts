import { UserEntity } from "../../../../../auth/src/modules/user/entities/User";
import { ProjectService } from "../../project/services";
import { TransactionTagRepository } from "../repositories/tag";

export class TransactionTagService {
    constructor(
        private repo: TransactionTagRepository,
        private projectService: ProjectService
    ) {}

    public async getByCashbox(projectId: number, cashboxId: number, user: UserEntity) {
        await this.projectService.authorize(projectId, user, 'transaction:read');
        
        const fields = {
            transactions: {
                some: {
                    AND: [
                        {cashboxId},
                        {cashbox: {
                            projectId
                        }},
                        {isDeleted: false}
                    ]
                }
            }
        };

        const include = {transactions: true};

        const finded = await this.repo.findByFields(fields, include);

        return finded.map(i => i.response());
    }
    
}