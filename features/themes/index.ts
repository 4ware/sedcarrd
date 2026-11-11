/** Client-safe entry point of the themes feature. Theme keys without React: ./registry. */
export { ThemePicker } from "./components/theme-picker";
export { ThemedProfile } from "./components/themed-profile";
export type { ProfileSectionKey, ProfileView, SectionSlot, ThemeProps } from "./lib/types";
export { useProfileView } from "./lib/use-profile-view";
export { DEFAULT_THEME, isThemeKey, THEME_KEYS, type ThemeKey } from "./registry";
