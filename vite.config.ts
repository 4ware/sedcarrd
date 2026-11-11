import { fileURLToPath } from "node:url";
import { defineConfig, type Plugin } from "vite";
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
  "@better-upload/server",
  "@better-upload/server/clients",
  "@better-upload/server/helpers",
  "shortid",
  "ts-slug",
];

/**
 * shortid's Node build reads the cluster worker id via `require("cluster")`, which Cloudflare Workers
 * don't provide. Use the package's own browser variant of that file (it exports 0) everywhere.
 */
function shortidWithoutCluster() {
  const browserVariant = fileURLToPath(
    new URL("./node_modules/shortid/lib/util/cluster-worker-id-browser.js", import.meta.url),
  );
  return {
    name: "shortid-without-cluster",
    enforce: "pre",
    resolveId(source: string, importer: string | undefined) {
      if (source === "./util/cluster-worker-id" && importer?.includes("/shortid/lib/")) return browserVariant;
      return null;
    },
  } satisfies Plugin;
}

export default defineConfig({
  environments: {
    rsc: {
      optimizeDeps: {
        include: serverOnlyDeps,
        // Pre-bundling (Rolldown) doesn't run the Vite plugins below: apply the same swap there.
        rolldownOptions: { plugins: [shortidWithoutCluster()] },
      },
    },
  },
  plugins: [
    shortidWithoutCluster(),
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
