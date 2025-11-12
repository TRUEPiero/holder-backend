import {Elysia} from "elysia";
import { AuthController } from "./controllers/auth";
import { UserController } from "./controllers/user";
import jwt from "@elysiajs/jwt";

export const app = new Elysia()
.use(jwt({secret: process.env.JWT_SECRET!}))
.use(AuthController)
.use(UserController)
