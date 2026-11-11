import { beforeEach, describe, expect, test } from "bun:test";
import { screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { routerMock } from "@/test/next-navigation-mock";
import { renderWithIntl } from "@/test/render-with-intl";
import { LocaleSwitcher } from "./locale-switcher";

describe("LocaleSwitcher", () => {
  beforeEach(() => {
    routerMock.replace.mockClear();
  });

  test("shows the current locale on the trigger", () => {
    renderWithIntl(<LocaleSwitcher />, { locale: "de" });
    expect(screen.getByRole("button", { name: "Sprache wählen" })).toHaveTextContent("de");
  });

  test("lists every language and switches to the chosen one", async () => {
    const user = userEvent.setup();
    renderWithIntl(<LocaleSwitcher />, { locale: "de" });

    await user.click(screen.getByRole("button", { name: "Sprache wählen" }));
    expect(screen.getByRole("menuitem", { name: "Deutsch" })).toBeInTheDocument();
    await user.click(screen.getByRole("menuitem", { name: "English" }));

    expect(routerMock.replace).toHaveBeenCalledTimes(1);
    expect(routerMock.replace.mock.calls[0]?.[0]).toBe("/en");
  });

  test("does nothing when the current language is picked", async () => {
    const user = userEvent.setup();
    renderWithIntl(<LocaleSwitcher />, { locale: "en" });

    await user.click(screen.getByRole("button", { name: "Choose language" }));
    await user.click(screen.getByRole("menuitem", { name: "English" }));

    expect(routerMock.replace).not.toHaveBeenCalled();
  });
});
