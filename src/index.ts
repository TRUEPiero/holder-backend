import { Elysia } from "elysia";
import { corsPlugin } from "./plugins/cors";
import { BotController } from "../modules/bot";
import { app as authApp } from "../modules/auth";
import { app as projectApp } from "../modules/project";


const app = new Elysia()
  .use(corsPlugin)
  .use(authApp)
  .use(projectApp)
  .get("/", () => "Hello Elysia")

  .listen(3000);

export type App = typeof app

await BotController.start();

console.log(`🦊 Elysia is running at ${app.server?.hostname}:${app.server?.port}`);
