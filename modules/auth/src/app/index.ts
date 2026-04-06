import {Elysia} from "elysia";
import { AuthController } from "../modules/auth/routes";
import { UserController } from "../modules/user/routes";

export const app = new Elysia()
.use(AuthController)
.use(UserController)
