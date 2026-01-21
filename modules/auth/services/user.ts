import { BaseService } from "@shared/BaseService";

export class UserService extends BaseService<'user'> {
    
    constructor() {
        super('user')
    }

    async updateUser(userId: number, data: any) {
        const user = await this.updateByFields({id: userId}, data);

        return user;
    }
}
