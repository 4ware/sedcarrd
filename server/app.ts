import { Elysia } from "elysia";
import { helloRoutes } from "./routes/hello";

/**
 * The API: one Elysia app mounted at /api by app/api/[[...slugs]]/route.ts.
 * Register every router (global ones from ./routes, feature ones from features/<name>/api) here.
 *
 * Cloudflare Workers forbid runtime code generation (eval / new Function) inside requests, and
 * vinext loads route modules lazily, so Elysia's JIT compilation must stay off:
 * - aot: false              → no generated route handlers
 * - normalize: "typebox"    → no generated exact-mirror cleaners
 */
export const app = new Elysia({ prefix: "/api", aot: false, normalize: "typebox" }).use(helloRoutes);

export type App = typeof app;
