import { ResponseUser, User } from "../../../../auth/src/common/types/user";
import { t } from "elysia";

type MemberRoles = 'viewer' | 'editor';

type MemberRole = {
    name: string,
    permissions: any[]
};

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

const memberRole = t.Enum({
  viewer: 'viewer',
  editor: 'editor',
});

const ResponseMember = t.Object({
    id: t.Number(),
    projectId: t.Number(),
    role: t.Any(),
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
    MemberRole,
    MemberRoles,
    Member
}

export {
    memberRole,
    ResponseMember,
    ResponseObject,
    ResponseObjects
}