import { describe, expect, test } from "bun:test";
import { screen, within } from "@testing-library/react";
import { renderWithIntl } from "@/test/render-with-intl";
import { headerCtaHref, navItems } from "../../lib/content";
import { SiteHeader } from "./site-header";

const labels = ["Why Sedcarrd", "Your page", "For every role", "Questions"];

describe("SiteHeader", () => {
  test("renders the brand link home", () => {
    renderWithIntl(<SiteHeader />);
    expect(screen.getByRole("link", { name: "sedcarrd home" })).toHaveAttribute("href", "/en");
  });

  test("renders every nav item", () => {
    renderWithIntl(<SiteHeader />);
    const nav = screen.getByRole("navigation", { name: "Main" });
    navItems.forEach((item, index) => {
      expect(within(nav).getByRole("link", { name: labels[index] })).toHaveAttribute("href", item.href);
    });
  });

  test("renders the call to action and the language chooser", () => {
    renderWithIntl(<SiteHeader />);
    expect(screen.getByRole("link", { name: "Make room for your work" })).toHaveAttribute("href", headerCtaHref);
    expect(screen.getByRole("button", { name: "Choose language" })).toBeInTheDocument();
  });

  test("links home without a prefix for the default (German) locale", () => {
    renderWithIntl(<SiteHeader />, { locale: "de" });
    expect(screen.getByRole("link", { name: "sedcarrd Startseite" })).toHaveAttribute("href", "/");
  });
});
