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

type authorizeMode = 'all' | 'any'

export class ProjectPolicy {
  static getMemberRole(
    project: ProjectEntity, 
    user: UserEntity
  ): ProjectActorRole | null {
    if (project.getOwner() === user.getId()) {
      return {
        name: 'owner',
        permissions: []
      };
    }

    const members = project.getMembers()
    const member = members?.find((m) => {
      const memberUserId = m.userId ?? m.user?.id;
      return memberUserId === user.getId();
    });

    return member?.role ?? null;
  }

  static can(
    project: ProjectEntity, 
    user: UserEntity, 
    permission: ProjectPermission | ProjectPermission[],
    mode: authorizeMode
  ): boolean {
    const role = this.getMemberRole(project, user);
    if (!role) return false;
    if (role.name === 'owner') return true;

    const permissions = Array.isArray(permission) ? permission : [permission];
    
    return mode === 'all' 
      ? permissions.every(permission => role.permissions.includes(permission))
      : permissions.some(permission => role.permissions.includes(permission))
  }

  static authorize(
    project: ProjectEntity, 
    user: UserEntity, 
    permission: ProjectPermission | ProjectPermission[],
    mode: authorizeMode = 'all'
  ): void {
    if (!this.can(project, user, permission, mode)) {
      throw new AccessDeniedError();
    }
  }
}

export type {
  authorizeMode
}
