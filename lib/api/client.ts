import { treaty } from "@elysiajs/eden";
import type { App } from "@/server/app";
import type { ApiClient } from "./types";

/**
 * Browser API client: talks to /api over HTTP on the current origin.
 * Only the App *type* is imported, so no server code ends up in the client bundle.
 * Use it through TanStack Query hooks, never directly in components.
 */
export const api: ApiClient = treaty<App>(typeof window === "undefined" ? "http://localhost" : window.location.origin).api;
