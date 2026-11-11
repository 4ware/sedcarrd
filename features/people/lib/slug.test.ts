import { describe, expect, test } from "bun:test";
import shortid from "shortid";
import { keepsSlug, personSlugBase, SLUG_BASE_MAX_LENGTH, withShortid } from "./slug";

describe("personSlugBase", () => {
  test.each([
    ["Lena", "Vogt", "lena-vogt"],
    ["Jürgen", "Weiß", "juergen-weiss"],
    ["Paula", "Ríos", "paula-rios"],
    ["Zoë", "O'Brien-Smith", "zoe-obrien-smith"],
    ["Łukasz", "Żółć", "lukasz-zolc"],
    ["  Mara ", "  Ellison", "mara-ellison"],
  ])("%s %s → %s", (first, last, slug) => {
    expect(personSlugBase(first, last)).toBe(slug);
  });

  test("falls back when the name has no slug characters", () => {
    expect(personSlugBase("🎭", "🎬")).toBe("person");
  });

  test("is capped without a trailing dash", () => {
    const slug = personSlugBase("a".repeat(60), "b".repeat(60));
    expect(slug.length).toBeLessThanOrEqual(SLUG_BASE_MAX_LENGTH);
    expect(slug.endsWith("-")).toBe(false);
  });
});

describe("withShortid", () => {
  test("appends a minus and a shortid", () => {
    const slug = withShortid("juergen-weiss");
    expect(slug.startsWith("juergen-weiss-")).toBe(true);
    expect(shortid.isValid(slug.slice("juergen-weiss-".length))).toBe(true);
  });

  test("differs every time", () => {
    expect(new Set(Array.from({ length: 500 }, () => withShortid("lena-vogt"))).size).toBe(500);
  });
});

describe("keepsSlug", () => {
  const lena = { firstName: "Lena", lastName: "Vogt" };

  test("keeps the slug while the name's slug stays the same", () => {
    expect(keepsSlug("lena-vogt", lena, lena)).toBe(true);
    expect(keepsSlug("lena-vogt-dJHqcvJLq8", lena, lena)).toBe(true);
    expect(keepsSlug("lena-vogt-dJHqcvJLq8", lena, { firstName: "lena", lastName: " Vogt " })).toBe(true);
  });

  test("renews it when the name changes, also if the old slug starts like the new one", () => {
    expect(keepsSlug("lena-vogt-dJHqcvJLq8", lena, { firstName: "Mara", lastName: "Vogt" })).toBe(false);
    const hyphenated = { firstName: "Lena", lastName: "Vogt-Ellison" };
    expect(keepsSlug("lena-vogt-ellison", hyphenated, lena)).toBe(false);
    expect(keepsSlug("lena-vogt-ellison-dJHqcvJ", hyphenated, lena)).toBe(false);
  });

  test("renews slugs that were not made from the current name (e.g. backfilled)", () => {
    const juergen = { firstName: "Jürgen", lastName: "Weiß" };
    expect(keepsSlug("j-rgen-wei--474a4de1", juergen, juergen)).toBe(false);
  });
});
