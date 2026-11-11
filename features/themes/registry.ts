/**
 * Theme keys, without any React code, so the API and the database layer can import them too
 * (entry point like auth's server.ts).
 *
 * - Hand-built themes: ./components/themes/<key>.tsx
 * - Preset themes: a config in ./components/themes/presets.ts rendered by a shared layout
 */
export const CUSTOM_THEME_KEYS = ["classic", "mono", "midnight", "sunset"] as const;

export const PRESET_THEME_KEYS = [
  // stack: narrow centered card
  "paper",
  "ink",
  "lavender",
  "dotted",
  // hero: full-bleed background, name low on the page
  "forest",
  "dune",
  "ocean",
  "noir",
  // split: wide card, name left, coloured panel right
  "studio",
  "citrus",
  "lagoon",
  "plum",
  // columns: wide card, Basisdaten in three columns
  "grid",
  "neon",
  "sage",
  "blueprint",
  // banner: card with a coloured banner for the name
  "candy",
  "aurora",
  "clay",
  "slate",
] as const;

export const THEME_KEYS = [...CUSTOM_THEME_KEYS, ...PRESET_THEME_KEYS] as const;

export type ThemeKey = (typeof THEME_KEYS)[number];
export type PresetThemeKey = (typeof PRESET_THEME_KEYS)[number];

export const DEFAULT_THEME: ThemeKey = "classic";

export function isThemeKey(value: unknown): value is ThemeKey {
  return typeof value === "string" && (THEME_KEYS as readonly string[]).includes(value);
}
