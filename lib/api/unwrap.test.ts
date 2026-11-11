import { describe, expect, test } from "bun:test";
import { ApiError, unwrap } from "./unwrap";

describe("unwrap", () => {
  test("returns data on success", async () => {
    expect(await unwrap(Promise.resolve({ data: { ok: true }, error: null }))).toEqual({ ok: true });
  });

  test("throws an ApiError carrying status and body on failure", async () => {
    const failing = unwrap(Promise.resolve({ data: null, error: { status: 422, value: { message: "bad" } } }));

    await expect(failing).rejects.toBeInstanceOf(ApiError);
    await expect(failing).rejects.toMatchObject({ status: 422, value: { message: "bad" } });
  });
});
