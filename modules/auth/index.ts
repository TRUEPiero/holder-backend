import {Elysia} from "elysia";
import { deriveUser } from '../../src/plugins/deriveUser';

import { AuthController } from "./controllers/auth";
import { UserController } from "./controllers/user";
import jwt from "@elysiajs/jwt";

export const app = new Elysia()
.use(jwt({secret: process.env.JWT_SECRET!}))
.derive(deriveUser)
.use(AuthController)
.use(UserController)
