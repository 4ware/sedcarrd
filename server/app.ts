import { Elysia } from "elysia";
import { peopleRoutes } from "@/features/people/api/routes";
import { handleUploadRequest } from "@/features/people/api/upload";
import { accountRoutes, handleAuthRequest } from "./routes/auth";
import { healthRoutes } from "./routes/health";
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
export const app = new Elysia({ prefix: "/api", aot: false, normalize: "typebox" })
  .mount("/auth", handleAuthRequest)
  // better-upload: pre-signed S3 upload URLs (client: useUploadFiles, default api "/api/upload").
  .mount("/upload", handleUploadRequest)
  .use(helloRoutes)
  .use(healthRoutes)
  .use(accountRoutes)
  .use(peopleRoutes);

export type App = typeof app;
