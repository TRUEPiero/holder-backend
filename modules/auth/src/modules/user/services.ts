import { BaseService } from "@shared/BaseService";

export class UserService extends BaseService<'user'> {
    
    constructor() {
        super('user')
    }

    async getUser(userId: number) {
        const user = await this.getById(userId);

        return user;
    }

    async getUserByEmail(email: string) {
        const user = await this.getFirstByFields({
            email
        });

        return user;
    }

    async updateUser(userId: number, data: any, status: any) {
        const user = await this.updateByFields({id: userId}, data);

        if(!user) return status(500, {code: 'UPDATE_ERROR', description: 'Error while updating user'})

        return user;
    }
}
