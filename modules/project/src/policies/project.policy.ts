import { AccessDeniedError } from "@common/errors";
import { ProjectEntity } from "../modules/project/entities/Project";
import { UserEntity } from "../../../auth/src/modules/user/entities/User";
import { MemberRoles } from "../modules/member/types";

export type ProjectPermission =
  | "project:read"
  | "project:update"
  | "project:delete"
  | "cashbox:read"
  | "cashbox:create"
  | "cashbox:update"
  | "cashbox:delete"
  | "transaction:read"
  | "transaction:create"
  | "transaction:delete"
  | "member:invite"
  | "member:update"
  | "member:delete"
  | "settings:read"
  | "settings:update";

type ProjectActorRole = "owner" | MemberRoles;

const permissionsByRole: Record<ProjectActorRole, ProjectPermission[]> = {
  owner: [
    "project:read",
    "project:update",
    "project:delete",
    "cashbox:read",
    "cashbox:create",
    "cashbox:update",
    "cashbox:delete",
    "transaction:read",
    "transaction:create",
    "transaction:delete",
    "member:invite",
    "member:update",
    "settings:read",
    "settings:update",
  ],
  editor: [
    "project:read",
    "project:update",
    "cashbox:read",
    "cashbox:create",
    "cashbox:update",
    "cashbox:delete",
    "transaction:read",
    "transaction:create",
    "transaction:delete",
    "settings:read",
    "settings:update",
  ],
  viewer: [
    "project:read",
    "cashbox:read",
    "transaction:read",
    "settings:read",
  ],
};

export class ProjectPolicy {
  static getActorRole(project: ProjectEntity, user: UserEntity): ProjectActorRole | null {
    if (project.ownerId === user.id) return "owner";

    const member = project.members?.find((m) => {
      const memberUserId = m.userId ?? m.user?.id;
      return memberUserId === user.id;
    });

    return member?.role ?? null;
  }

  static can(project: ProjectEntity, user: UserEntity, permission: ProjectPermission): boolean {
    const role = this.getActorRole(project, user);
    if (!role) return false;

    return permissionsByRole[role].includes(permission);
  }

  static authorize(project: ProjectEntity, user: UserEntity, permission: ProjectPermission): void {
    if (!this.can(project, user, permission)) {
      throw new AccessDeniedError();
    }
  }
}
