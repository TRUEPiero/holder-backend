import { Elysia } from "elysia";
import { corsPlugin } from "@plugins/cors";
import { swaggerPlugin } from "@plugins/swagger";
import { BotController } from "../modules/bot";
import { app as authApp } from "../modules/auth/src/app";
import { app as projectApp } from "../modules/project/src/app";
import { initRedis } from "@common/redis";
import { errorHandler } from "@plugins/errorHandler";

const PORT = process.env.SERVER_PORT;

if(!PORT) throw new Error("SERVER_PORT is not defined");

await BotController.start();
await initRedis();

const app = new Elysia()
  .onError(errorHandler)
  .use(swaggerPlugin)
  .use(corsPlugin)
  .use(authApp)
  .use(projectApp)
  .get("/", () => "Hello Elysia")

  .listen(PORT);

export type App = typeof app

console.log(`[App] started ${app.server?.hostname}:${app.server?.port}`);
