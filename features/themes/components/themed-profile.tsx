import type { ComponentType } from "react";
import type { ThemeProps } from "../lib/types";
import { CUSTOM_THEME_KEYS, type ThemeKey } from "../registry";
import { ClassicTheme } from "./themes/classic";
import { MidnightTheme } from "./themes/midnight";
import { MonoTheme } from "./themes/mono";
import { PresetTheme } from "./themes/preset-theme";
import { PRESETS } from "./themes/presets";
import { SunsetTheme } from "./themes/sunset";

/** Hand-built themes. A new one: add its key to CUSTOM_THEME_KEYS (../registry.ts) and its component here. */
const CUSTOM_THEMES = {
  classic: ClassicTheme,
  mono: MonoTheme,
  midnight: MidnightTheme,
  sunset: SunsetTheme,
} satisfies Record<(typeof CUSTOM_THEME_KEYS)[number], ComponentType<ThemeProps>>;

const isCustom = (theme: ThemeKey): theme is keyof typeof CUSTOM_THEMES =>
  (CUSTOM_THEME_KEYS as readonly string[]).includes(theme);

/** Renders a profile in the given theme. */
export function ThemedProfile({ theme, ...props }: ThemeProps & { theme: ThemeKey }) {
  if (isCustom(theme)) {
    const Theme = CUSTOM_THEMES[theme];
    return (
      <div data-theme-key={theme}>
        <Theme {...props} />
      </div>
    );
  }
  // Preset themes: a config (./themes/presets.ts) for one of the shared layouts.
  return (
    <div data-theme-key={theme}>
      <PresetTheme preset={PRESETS[theme]} {...props} />
    </div>
  );
}
