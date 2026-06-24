import { ResponseUser, User } from "../../../../auth/src/common/types/user";
import { t } from "elysia";

type MemberRole = {
    name: string,
    permissions: any[]
};

type Member = {
    id: number;
    projectId: number;
    userId: number;
    isDeleted: boolean,
    user: User,
    role: MemberRole
    joinedAt: Date
}

type SoftDeleteData = {
    isDeleted: boolean
}

const ResponseMember = t.Object({
    id: t.Number(),
    projectId: t.Number(),
    role: t.Any(),
    user: t.Optional(ResponseUser),
    userId: t.Number(),
    joinedAt: t.Date()
})

const ResponseObject = t.Object({
    data: ResponseMember,
})

const ResponseObjects = t.Object({
    data: t.Array(ResponseMember),
})

export type{
    SoftDeleteData,
    MemberRole,
    Member,
    User
}

export {
    ResponseMember,
    ResponseObject,
    ResponseObjects
}