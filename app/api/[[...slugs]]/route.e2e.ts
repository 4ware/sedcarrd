import { expect, test } from "@playwright/test";

test("GET /api/hello returns JSON from the running worker", async ({ request }) => {
  const response = await request.get("/api/hello");

  expect(response.ok()).toBe(true);
  expect(await response.json()).toEqual({ message: "Hello from vinext on Cloudflare Workers" });
});

test("GET /api/hello validates its query", async ({ request }) => {
  const ok = await request.get("/api/hello?name=Kai");
  expect(await ok.json()).toEqual({ message: "Hello Kai from vinext on Cloudflare Workers" });

  const invalid = await request.get(`/api/hello?name=${"x".repeat(65)}`);
  expect(invalid.status()).toBe(422);
});

test("unknown API routes return 404", async ({ request }) => {
  expect((await request.get("/api/does-not-exist")).status()).toBe(404);
});
