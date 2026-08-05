import {Elysia} from "elysia";
import { AuthController } from "../modules/auth/routes";
import { UserController } from "../modules/user/routes";
import { RegisterController } from "../modules/register/routes";

export const app = new Elysia()
.use(AuthController)
.use(UserController)
.use(RegisterController)
