async function checkValidPass(password: string, valid: string) {
    return await Bun.password.verify(password, valid)
}

async function hashPassword(password: string) {
    return await Bun.password.hash(password);
}

export {
    checkValidPass,
    hashPassword
}