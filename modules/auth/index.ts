import {Elysia} from "elysia";
import { AuthController } from "./controllers/auth";
import { UserController } from "./controllers/user";

export const app = new Elysia()
.use(AuthController)
.use(UserController)
