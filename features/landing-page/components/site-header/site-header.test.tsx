import { describe, expect, test } from "bun:test";
import { screen, within } from "@testing-library/react";
import { renderWithIntl } from "@/test/render-with-intl";
import { navItems } from "../../lib/content";
import { SiteHeader } from "./site-header";

const labels = ["Why Sedcarrd", "Your page", "For every role", "Questions"];

describe("SiteHeader", () => {
  test("renders the brand link home", () => {
    renderWithIntl(<SiteHeader />);
    expect(screen.getByRole("link", { name: "sedcarrd home" })).toHaveAttribute("href", "/en");
  });

  test("renders every nav item", () => {
    renderWithIntl(<SiteHeader />);
    const nav = screen.getByRole("navigation", { name: "Main navigation" });
    navItems.forEach((item, index) => {
      expect(within(nav).getByRole("link", { name: labels[index] })).toHaveAttribute("href", item.href);
    });
  });

  test("links anonymous visitors to log in and sign up", () => {
    renderWithIntl(<SiteHeader />);
    expect(screen.getByRole("link", { name: "Log in" })).toHaveAttribute("href", "/en/login");
    expect(screen.getByRole("link", { name: "Make room for your work" })).toHaveAttribute("href", "/en/signup");
    expect(screen.queryByRole("link", { name: "Go to dashboard" })).not.toBeInTheDocument();
    expect(screen.getByRole("button", { name: "Choose language" })).toBeInTheDocument();
  });

  test("links signed-in visitors to their dashboard instead", () => {
    renderWithIntl(<SiteHeader isSignedIn />);
    expect(screen.getByRole("link", { name: "Go to dashboard" })).toHaveAttribute("href", "/en/dashboard");
    expect(screen.queryByRole("link", { name: "Log in" })).not.toBeInTheDocument();
    expect(screen.queryByRole("link", { name: "Make room for your work" })).not.toBeInTheDocument();
  });

  test("uses unprefixed German paths for the default locale", () => {
    renderWithIntl(<SiteHeader />, { locale: "de" });
    expect(screen.getByRole("link", { name: "sedcarrd Startseite" })).toHaveAttribute("href", "/");
    expect(screen.getByRole("link", { name: "Anmelden" })).toHaveAttribute("href", "/login");
    expect(screen.getByRole("link", { name: "Schaffe Raum für deine Arbeit" })).toHaveAttribute("href", "/signup");
  });
});
