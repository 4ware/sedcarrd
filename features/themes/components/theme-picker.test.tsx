import { expect, mock, test } from "bun:test";
import { screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { renderApp } from "@/test/render-app";
import { isThemeKey, THEME_KEYS } from "../registry";
import { ThemePicker } from "./theme-picker";

test("lists every theme as a radio and reports the choice", async () => {
  const onChange = mock((_theme: string) => {});
  renderApp(<ThemePicker value="classic" onChange={onChange} />, { locale: "de" });

  const radios = screen.getAllByRole("radio");
  expect(radios).toHaveLength(THEME_KEYS.length);
  expect(radios).toHaveLength(24);
  expect(screen.getByRole("group", { name: "Design" })).toBeInTheDocument();
  expect(screen.getByRole("radio", { name: "Klassisch" })).toBeChecked();

  await userEvent.setup().click(screen.getByRole("radio", { name: "Nacht" }));
  expect(onChange).toHaveBeenCalledWith("midnight");
  expect(screen.getByRole("radio", { name: "Nacht" })).toHaveAccessibleDescription(
    "Dunkler Verlauf über den ganzen Bildschirm mit Glas-Kacheln.",
  );
});

test("isThemeKey only accepts registered keys", () => {
  expect(isThemeKey("sunset")).toBe(true);
  expect(isThemeKey("disco")).toBe(false);
  expect(isThemeKey(undefined)).toBe(false);
});
