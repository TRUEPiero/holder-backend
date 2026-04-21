import { Elysia } from "elysia";
import { corsPlugin } from "@plugins/cors";
import { swaggerPlugin } from "@plugins/swagger";
import { BotController } from "../modules/bot";
import { app as authApp } from "../modules/auth/src/app";
import { app as projectApp } from "../modules/project/src/app";
import { initRedis } from "@common/redis";

const PORT = process.env.SERVER_PORT;

if(!PORT) throw new Error("SERVER_PORT Undefined");

await BotController.start();
await initRedis();

const app = new Elysia()
  .use(swaggerPlugin)
  .use(corsPlugin)
  .use(authApp)
  .use(projectApp)
  .get("/", () => "Hello Elysia")

  .listen(PORT);

export type App = typeof app

console.log(`🦊 Elysia is running at ${app.server?.hostname}:${app.server?.port}`);
