import { expect, test } from "bun:test";
import { passwordsMatch } from "./passwords-match";

test.each([
  ["secret password", "secret password", true],
  ["secret password", "secret passwort", false],
  ["secret ", "secret", false],
  ["", "", true],
])("passwordsMatch(%p, %p) is %p", (a, b, expected) => {
  expect(passwordsMatch(a, b)).toBe(expected);
});
