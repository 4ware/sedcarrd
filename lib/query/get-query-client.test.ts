import { describe, expect, test } from "bun:test";
import { ApiError } from "@/lib/api/unwrap";
import { shouldRetry } from "./get-query-client";

describe("shouldRetry", () => {
  test.each([401, 404, 422])("does not retry a %i", (status) => {
    expect(shouldRetry(0, new ApiError(status, {}))).toBe(false);
  });

  test("retries server and network errors up to three times", () => {
    expect(shouldRetry(0, new ApiError(503, {}))).toBe(true);
    expect(shouldRetry(2, new TypeError("Failed to fetch"))).toBe(true);
    expect(shouldRetry(3, new TypeError("Failed to fetch"))).toBe(false);
  });
});
