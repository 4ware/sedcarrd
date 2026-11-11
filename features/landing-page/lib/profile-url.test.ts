import { describe, expect, test } from "bun:test";
import { profileUrl } from "./profile-url";

describe("profileUrl", () => {
  test("joins domain and slug", () => {
    expect(profileUrl("sedcarrd.com", "mara-ellison")).toBe("sedcarrd.com/mara-ellison");
  });

  test("does not double slashes", () => {
    expect(profileUrl("sedcarrd.com/", "/mara-ellison")).toBe("sedcarrd.com/mara-ellison");
  });
});
