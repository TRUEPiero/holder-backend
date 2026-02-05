import { Elysia } from "elysia";
import { corsPlugin } from "@plugins/cors";
import { swaggerPlugin } from "@plugins/swagger";
import { BotController } from "../modules/bot";
import { app as authApp } from "../modules/auth";
import { app as projectApp } from "../modules/project";

await BotController.start();

const app = new Elysia()
  .use(swaggerPlugin)
  .use(corsPlugin)
  .use(authApp)
  .use(projectApp)
  // .get("/", () => "Hello Elysia")

  .listen(process.env.DEV_PORT);

export type App = typeof app

console.log(`🦊 Elysia is running at ${app.server?.hostname}:${app.server?.port}`);
