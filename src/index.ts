import { Elysia } from "elysia";
import { corsPlugin } from "./plugins/cors";
import { app as authApp } from "../modules/auth";
import { app as projectApp } from "../modules/project";

const app = new Elysia()
  .use(corsPlugin)
  .use(authApp)
  .use(projectApp)
  .get("/", () => "Hello Elysia")

  .listen(3000);

export type App = typeof app

console.log(`🦊 Elysia is running at ${app.server?.hostname}:${app.server?.port}`);
