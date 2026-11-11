"use client";

import { CheckIcon } from "lucide-react";
import { useTranslations } from "next-intl";
import { cn } from "@/lib/utils";
import { CUSTOM_THEME_KEYS, THEME_KEYS, type ThemeKey } from "../registry";
import { PRESETS } from "./themes/presets";

type Swatch = { page: string; card: string; text: string; font: string; accent: string };

/** Miniatures of the hand-built themes; preset themes bring their own swatch. */
const CUSTOM_SWATCHES: Record<(typeof CUSTOM_THEME_KEYS)[number], Swatch> = {
  classic: { page: "bg-muted", card: "bg-background", text: "text-foreground", font: "font-serif", accent: "var(--primary)" },
  mono: {
    page: "bg-[#1d2433] bg-[radial-gradient(#2c3650_1px,transparent_1px)] bg-size-[6px_6px]",
    card: "bg-[#f6efe2]",
    text: "text-[#1d2433]",
    font: "font-mono",
    accent: "#e07a5f",
  },
  midnight: {
    page: "bg-[radial-gradient(ellipse_at_top,#25335e_0%,#0b1020_70%)]",
    card: "bg-white/10",
    text: "text-white",
    font: "font-sans",
    accent: "#8ab4ff",
  },
  sunset: {
    page: "bg-[#eceef2]",
    card: "bg-[linear-gradient(135deg,#f6a96b,#e8707a,#b4497e)]",
    text: "text-white",
    font: "font-serif",
    accent: "#ffffff",
  },
};

function swatchOf(key: ThemeKey): Swatch {
  if ((CUSTOM_THEME_KEYS as readonly string[]).includes(key)) {
    return CUSTOM_SWATCHES[key as (typeof CUSTOM_THEME_KEYS)[number]];
  }
  const preset = PRESETS[key as keyof typeof PRESETS];
  return { ...preset.swatch, accent: preset.accent };
}

type ThemePickerProps = {
  value: ThemeKey;
  onChange: (theme: ThemeKey) => void;
};

/** Radio cards with a miniature of every theme, two per row. */
export function ThemePicker({ value, onChange }: ThemePickerProps) {
  const t = useTranslations("Themes");

  return (
    <fieldset>
      <legend className="sr-only">{t("legend")}</legend>
      <div className="grid grid-cols-2 gap-3">
        {THEME_KEYS.map((key) => {
          const swatch = swatchOf(key);
          const checked = key === value;
          return (
            <label
              key={key}
              title={t(`descriptions.${key}`)}
              className={cn(
                "relative flex cursor-pointer flex-col gap-2 rounded-lg border p-2 transition-colors has-focus-visible:ring-2 has-focus-visible:ring-ring",
                checked ? "border-primary bg-primary/5" : "hover:bg-muted",
              )}
            >
              <input
                type="radio"
                name="theme"
                value={key}
                checked={checked}
                onChange={() => onChange(key)}
                aria-describedby={`theme-description-${key}`}
                className="sr-only"
              />
              <span aria-hidden="true" className={cn("flex h-20 items-center justify-center rounded-md", swatch.page)}>
                <span className={cn("flex h-12 w-20 flex-col justify-center gap-1 rounded-sm px-2 shadow-sm", swatch.card)}>
                  <span className={cn("text-xs leading-none font-semibold", swatch.text, swatch.font)}>Aa</span>
                  <span className="h-1 w-8 rounded-full" style={{ background: swatch.accent }} />
                  <span className={cn("h-1 w-10 rounded-full bg-current opacity-25", swatch.text)} />
                </span>
              </span>
              <span className="px-1 text-sm font-medium">{t(`names.${key}`)}</span>
              {checked ? (
                <CheckIcon
                  className="absolute top-3 right-3 size-4 rounded-full bg-primary p-0.5 text-primary-foreground"
                  aria-hidden="true"
                />
              ) : null}
            </label>
          );
        })}
      </div>
      {/* Descriptions outside the labels, so each radio's name is just the theme name. */}
      <div className="sr-only">
        {THEME_KEYS.map((key) => (
          <span key={key} id={`theme-description-${key}`}>
            {t(`descriptions.${key}`)}
          </span>
        ))}
      </div>
    </fieldset>
  );
}
