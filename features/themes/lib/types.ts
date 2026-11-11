import type { ComponentType, CSSProperties, ReactNode } from "react";

/** The blocks of a profile page; each can be wrapped (e.g. made editable) through the Section slot. */
export type ProfileSectionKey = "name" | "about" | "photos" | "skills" | "location" | "appearance";

/** Display-ready profile: everything a theme renders, already translated and formatted. */
export type ProfileView = {
  /** Full name; "" when not filled in (themes then show `placeholders.name`). */
  name: string;
  professions: string[];
  /** e.g. "Geboren 1994 in Berlin (32 Jahre)"; "" when unknown. */
  born: string;
  basicsTitle: string;
  /** Heading of the photo gallery (visually hidden; gives the page a proper outline). */
  photosTitle: string;
  /** Shown for an empty value, e.g. "—". */
  emptyValue: string;
  /** Photos in display order (signed URLs), with alt text. */
  images: { id: string; url: string; alt: string }[];
  placeholders: { name: string; about: string; photos: string };
  groups: {
    key: Extract<ProfileSectionKey, "skills" | "location" | "appearance">;
    title: string;
    rows: { label: string; value: string }[];
  }[];
};

/**
 * Wraps one block of the page. The editor passes a clickable, outlined wrapper; a public page can
 * pass a plain one. Themes call it for every block and stay agnostic of editing.
 */
export type SectionSlot = ComponentType<{ section: ProfileSectionKey; className?: string; children: ReactNode }>;

export type ThemeProps = { profile: ProfileView; Section: SectionSlot };

/**
 * Colours every theme exposes as CSS variables on its root, so wrappers (e.g. the editor's outlines)
 * stay visible on light and dark themes alike.
 */
export function themeVars(accent: string, onAccent: string): CSSProperties {
  return { "--theme-accent": accent, "--theme-on-accent": onAccent } as CSSProperties;
}
