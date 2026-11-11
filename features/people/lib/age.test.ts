import { expect, test } from "bun:test";
import { ageFromBirthYear } from "./age";

test("derives the age from the birth year", () => {
  expect(ageFromBirthYear(2000, new Date("2026-11-11"))).toBe(26);
  expect(ageFromBirthYear(null)).toBeNull();
});
