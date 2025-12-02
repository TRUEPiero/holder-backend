import { BaseService } from "@shared/BaseService";

export class UserService extends BaseService<'user'> {
    
    async updateUser(userId: number, data: any): Promise<any> {
        const user = await this.updateByFields({id: userId}, data);

        return user;
    }
}
