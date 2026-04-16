import { MemberRole } from "@prisma/client";

export type Member = {
    id: number;
    projectId: number;
    userId: number;
    role: MemberRole
}