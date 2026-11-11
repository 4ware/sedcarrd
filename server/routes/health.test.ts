import { describe, expect, test } from "bun:test";
import { treaty } from "@elysiajs/eden";
import { app } from "../app";

const api = treaty(app).api;

describe("GET /api/health", () => {
  test("reports ok", async () => {
    const { data } = await api.health.get();
    expect(data).toEqual({ status: "ok" });
  });
});

// Talks to the real test database from docker-compose (`bun run db:up`).
describe.skipIf(!process.env.TEST_DATABASE_URL)("GET /api/health/db", () => {
  test("reaches the database", async () => {
    const { data, error } = await api.health.db.get();

    expect(error).toBeNull();
    expect(data).toEqual({ database: "ok" });
  });

  test("returns 503 when the database is unreachable", async () => {
    const original = process.env.DATABASE_URL;
    process.env.DATABASE_URL = "postgres://nobody:wrong@127.0.0.1:1/none";
    try {
      const { error } = await api.health.db.get();
      expect(error?.status).toBe(503);
    } finally {
      process.env.DATABASE_URL = original;
    }
  });
});
