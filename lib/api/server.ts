import { treaty } from "@elysiajs/eden";
import { app } from "@/server/app";
import type { ApiClient } from "./types";

/**
 * Server API client: calls the Elysia app in-process (no network hop).
 * For Server Components / prefetching only. Never import this from a client component.
 */
export const serverApi: ApiClient = treaty(app).api;
