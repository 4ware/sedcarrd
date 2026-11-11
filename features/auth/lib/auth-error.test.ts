import { describe, expect, test } from "bun:test";
import { AuthError, unwrapAuth } from "./auth-error";

describe("AuthError", () => {
  test.each([
    ["INVALID_EMAIL_OR_PASSWORD", 401, "invalidCredentials"],
    ["USER_ALREADY_EXISTS_USE_ANOTHER_EMAIL", 422, "userExists"],
    ["PASSWORD_TOO_SHORT", 400, "passwordTooShort"],
    ["EMAIL_NOT_VERIFIED", 403, "emailNotVerified"],
    ["SOMETHING_NEW", 500, "generic"],
    [undefined, 429, "tooManyRequests"],
  ] as const)("maps %s (%i) to %s", (code, status, key) => {
    expect(new AuthError(status, code).key).toBe(key);
  });
});

describe("unwrapAuth", () => {
  test("returns data on success", async () => {
    expect(await unwrapAuth(Promise.resolve({ data: { ok: 1 }, error: null }))).toEqual({ ok: 1 });
  });

  test("throws an AuthError on failure", async () => {
    const failing = unwrapAuth(
      Promise.resolve({ data: null, error: { status: 401, code: "INVALID_EMAIL_OR_PASSWORD" } }),
    );
    await expect(failing).rejects.toMatchObject({ name: "AuthError", status: 401, key: "invalidCredentials" });
  });
});
