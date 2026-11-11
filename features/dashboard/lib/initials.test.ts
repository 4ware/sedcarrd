import { expect, test } from "bun:test";
import { initials } from "./initials";

test.each([
  ["Mara Ellison", "ME"],
  ["  mara   jane  ellison ", "ME"],
  ["cher", "C"],
  ["", "?"],
  ["Ölaf Ärger", "ÖÄ"],
])("initials(%p) is %p", (name, expected) => {
  expect(initials(name)).toBe(expected);
});
