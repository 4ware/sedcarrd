import { describe, expect, test } from "bun:test";
import { GET } from "./route";

describe("GET /api/hello", () => {
  test("responds with a JSON greeting", async () => {
    const response = GET();

    expect(response.status).toBe(200);
    expect(response.headers.get("content-type")).toContain("application/json");
    expect(await response.json()).toEqual({
      message: "Hello from vinext on Cloudflare Workers",
    });
  });
});
