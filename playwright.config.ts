import { defineConfig, devices } from "@playwright/test";

const PORT = 5173;
// Set PLAYWRIGHT_BASE_URL to test an already running server (e.g. `vite preview` or a deployment).
const externalBaseURL = process.env.PLAYWRIGHT_BASE_URL;
const baseURL = externalBaseURL ?? `http://localhost:${PORT}`;

export default defineConfig({
  // E2E specs live next to the code they cover, e.g. app/page.e2e.ts
  testDir: ".",
  testMatch: ["{app,features,components}/**/*.e2e.ts"],
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 2 : 0,
  workers: process.env.CI ? 1 : undefined,
  reporter: process.env.CI ? "github" : "list",
  use: {
    baseURL,
    // German is the default locale; an English browser would be redirected from "/" to "/en".
    locale: "de-DE",
    trace: "on-first-retry",
  },
  projects: [{ name: "chromium", use: { ...devices["Desktop Chrome"] } }],
  webServer: externalBaseURL
    ? undefined
    : {
        command: `bun run dev --port ${PORT} --strictPort`,
        url: baseURL,
        reuseExistingServer: !process.env.CI,
        timeout: 120_000,
      },
});
