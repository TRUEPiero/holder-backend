import { PaginationParam, PaginationResult } from "@shared-types/index.ts";
import { UserEntity } from "../../../auth/src/modules/user/entities/User";
import { Entity } from "./Entity";

export abstract class CRUD {
    abstract getById(id: number, user: UserEntity, parentId?: number): Promise<Entity>
    abstract getWithPagination(parameters: PaginationParam): Promise<PaginationResult>
    abstract create(user: UserEntity, data: any, parentId?: number): Promise<Entity>
    abstract update(id: number, user: UserEntity, data: any, parentId?: number): Promise<Entity>
    abstract delete(id: number, user: UserEntity, parentId?: number): Promise<Entity>
}