import type { Treaty } from "@elysiajs/eden";
import type { App } from "@/server/app";

/** Typed Eden client for the /api routes. Implemented by `api` (browser) and `serverApi` (server). */
export type ApiClient = Treaty.Create<App>["api"];
