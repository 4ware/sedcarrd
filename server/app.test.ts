import { describe, expect, test } from "bun:test";
import { treaty } from "@elysiajs/eden";
import { app } from "./app";

// Eden calls the Elysia instance directly: no network, fully typed.
const api = treaty(app).api;

describe("API", () => {
  test("GET /api/hello", async () => {
    const { data, error } = await api.hello.get();

    expect(error).toBeNull();
    expect(data).toEqual({ message: "Hello from vinext on Cloudflare Workers" });
  });

  test("GET /api/hello?name=…", async () => {
    const { data } = await api.hello.get({ query: { name: "Kai" } });
    expect(data?.message).toBe("Hello Kai from vinext on Cloudflare Workers");
  });

  test("rejects an invalid query with 422", async () => {
    const { error } = await api.hello.get({ query: { name: "" } });
    expect(error?.status).toBe(422);
  });

  test("handles raw Requests the way the route handler does", async () => {
    const response = await app.fetch(new Request("http://localhost/api/hello"));
    expect(response.status).toBe(200);
    expect(await response.json()).toEqual({ message: "Hello from vinext on Cloudflare Workers" });
  });
});
