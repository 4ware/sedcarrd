import { defineConfig } from "vite";
import vinext from "vinext";
import { cloudflare } from "@cloudflare/vite-plugin";
import { imagesOptimizer } from "@vinext/cloudflare/images/images-optimizer";

/**
 * Server-only libraries that are only reached through lazily loaded route modules, which Vite's
 * dependency scan can't see. Without pre-bundling them up front, Vite discovers their internals
 * (better-auth's @better-auth/*, jose, @noble/*, zod, …) one by one in dev and re-bundles the RSC
 * dependencies each time. Those mid-session re-bundles can leave two copies of React in the module
 * graph: "Invalid hook call" and next-intl's "`useTranslations` is not callable within an async
 * component". Add new server-only packages here.
 */
const serverOnlyDeps = [
  "better-auth",
  "better-auth/adapters/drizzle",
  "drizzle-orm",
  "drizzle-orm/_relations",
  "drizzle-orm/pg-core",
  "drizzle-orm/postgres-js",
  "postgres",
  "elysia",
  "@elysiajs/eden",
];

export default defineConfig({
  environments: {
    rsc: { optimizeDeps: { include: serverOnlyDeps } },
  },
  plugins: [
    vinext({
      images: { optimizer: imagesOptimizer() },
    }),
    cloudflare({
      viteEnvironment: {
        name: "rsc",
        childEnvironments: ["ssr"],
      },
    }),
  ],
});
