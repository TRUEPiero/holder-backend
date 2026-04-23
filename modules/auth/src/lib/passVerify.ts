import { UserEntity } from "../modules/user/entities/User"

async function checkValidPass(password: string, user: UserEntity) {
    return await Bun.password.verify(password, user.password)
}

export {
    checkValidPass
}