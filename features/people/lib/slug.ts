import shortid from "shortid";
// ts-slug 0.2.1 declares a default `slug` export but only ships the named `slugify` (same function).
import { slugify } from "ts-slug";

export const SLUG_BASE_MAX_LENGTH = 80;
/** Used when a name yields no slug characters at all (e.g. only emoji). */
export const SLUG_FALLBACK = "person";

/**
 * The readable part of a person's slug, e.g. "Jürgen Weiß" → "juergen-weiss" (German transliteration,
 * like the app's default locale). Never empty; at most SLUG_BASE_MAX_LENGTH characters.
 */
export function personSlugBase(firstName: string, lastName: string): string {
  const slug = slugify(`${firstName} ${lastName}`, { locale: "de" })
    .slice(0, SLUG_BASE_MAX_LENGTH)
    .replace(/-+$/, "");
  return slug || SLUG_FALLBACK;
}

/**
 * The slug for a name whose plain slug is already used: "-" and a shortid appended, e.g.
 * "juergen-weiss-dJHqcvJLq8". The database's unique constraint (person_slug_key) has the last word.
 */
export function withShortid(base: string): string {
  return `${base}-${shortid.generate()}`;
}

type Name = { firstName: string; lastName: string };

/**
 * Whether a save keeps the current slug: yes while the name's slug stays the same (so links stay
 * stable) and the current slug was made from it, plain or with a shortid. Other slugs (e.g. the
 * backfilled ones from the migration) are renewed.
 */
export function keepsSlug(currentSlug: string, before: Name, after: Name): boolean {
  const base = personSlugBase(after.firstName, after.lastName);
  if (base !== personSlugBase(before.firstName, before.lastName)) return false;
  return currentSlug === base || currentSlug.startsWith(`${base}-`);
}
