import { expect, test } from "@playwright/test";

test("GET /api/hello returns JSON from the running worker", async ({ request }) => {
  const response = await request.get("/api/hello");

  expect(response.ok()).toBe(true);
  expect(await response.json()).toEqual({
    message: "Hello from vinext on Cloudflare Workers",
  });
});
