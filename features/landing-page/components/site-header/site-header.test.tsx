import { describe, expect, test } from "bun:test";
import { render, screen, within } from "@testing-library/react";
import { headerCta, navItems } from "../../lib/content";
import { SiteHeader } from "./site-header";

describe("SiteHeader", () => {
  test("renders the brand link home", () => {
    render(<SiteHeader />);
    expect(screen.getByRole("link", { name: "sedcarrd home" })).toHaveAttribute("href", "/");
  });

  test("renders every nav item", () => {
    render(<SiteHeader />);
    const nav = screen.getByRole("navigation", { name: "Main" });
    for (const item of navItems) {
      expect(within(nav).getByRole("link", { name: item.label })).toHaveAttribute("href", item.href);
    }
  });

  test("renders the call to action", () => {
    render(<SiteHeader />);
    expect(screen.getByRole("link", { name: headerCta.label })).toHaveAttribute("href", headerCta.href);
  });
});
