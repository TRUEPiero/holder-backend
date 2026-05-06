import { MemberRole } from "@prisma/client";
import { ResponseUser, User } from "../../../../auth/src/common/types/user";
import { t } from "elysia";

type MemberRoles = MemberRole;

type Member = {
    id: number;
    projectId: number;
    userId: number;
    user: User,
    role: MemberRole
    joinedAt: Date
}

type SoftDeleteData = {
    isDeleted: boolean
}

const memberRole = t.Enum(MemberRole)

const ResponseMember = t.Object({
    id: t.Number(),
    projectId: t.Number(),
    role: t.String(),
    user: t.Optional(ResponseUser),
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
    MemberRoles,
    Member
}

export {
    memberRole,
    ResponseMember,
    ResponseObject,
    ResponseObjects
}