import { bindings, defineConfig, defineWorker } from "cf/config";

export default defineConfig({
  worker: defineWorker({
    name: "sedcarrd",
    entrypoint: "vinext/server/fetch-handler",
    compatibilityDate: "2026-11-11",
    compatibilityFlags: ["nodejs_compat"],
    assets: {
      htmlHandling: "none",
      notFoundHandling: "none",
      runWorkerFirst: ["/*", "!/_next/static/*", "!/*/_next/static/*"],
    },
    env: {
      ASSETS: bindings.assets(),
      IMAGES: bindings.images(),
      // Postgres connection string. Locally read from .env; in production set it with
      // `wrangler secret put DATABASE_URL` (or switch to a Hyperdrive binding).
      DATABASE_URL: bindings.secret(),
      // Better Auth: signing secret + public base URL (`wrangler secret put …` in production).
      BETTER_AUTH_SECRET: bindings.secret(),
      BETTER_AUTH_URL: bindings.secret(),
      // Resend API key for transactional email (`wrangler secret put RESEND_API_KEY` in production).
      RESEND_API_KEY: bindings.secret(),
      // Domain verified in Resend; emails are sent from hello@<domain>.
      RESEND_DOMAIN: bindings.text("sedcarrd.com"),
    },
  }),
});
