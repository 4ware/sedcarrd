import { defineConfig } from "drizzle-kit";

/**
 * drizzle-kit config. Run through the package.json `db:*` scripts so Bun loads .env.
 * DB_TARGET=test points every command at the test database instead of the development one.
 */
const url = process.env.DB_TARGET === "test" ? process.env.TEST_DATABASE_URL : process.env.DATABASE_URL;
if (!url) throw new Error("DATABASE_URL / TEST_DATABASE_URL is not set. Copy .env.example to .env.");

export default defineConfig({
  dialect: "postgresql",
  // Every feature owns its tables in features/<name>/db/schema.ts.
  schema: "./features/*/db/schema.ts",
  out: "./drizzle",
  dbCredentials: { url },
  verbose: true,
});
