import { AccessDeniedError } from "@common/errors";
import { ProjectEntity } from "../modules/project/entities/Project";
import { UserEntity } from "../../../auth/src/modules/user/entities/User";

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

type ProjectActorRole = {
  name: string,
  permissions: any[]
};

export class ProjectPolicy {
  static getMemberRole(project: ProjectEntity, user: UserEntity): ProjectActorRole | null {
    if (project.ownerId === user.id) {
      return {
        name: 'owner',
        permissions: []
      };
    }

    const members = project.getMembers()
    const member = members?.find((m) => {
      const memberUserId = m.userId ?? m.user?.id;
      return memberUserId === user.id;
    });

    return member?.role ?? null;
  }

  static can(project: ProjectEntity, user: UserEntity, permission: ProjectPermission): boolean {
    const role = this.getMemberRole(project, user);
    if (!role) return false;
    if (role.name === 'owner') return true;

    return role.permissions.includes(permission);
  }

  static authorize(project: ProjectEntity, user: UserEntity, permission: ProjectPermission): void {
    if (!this.can(project, user, permission)) {
      throw new AccessDeniedError();
    }
  }
}
