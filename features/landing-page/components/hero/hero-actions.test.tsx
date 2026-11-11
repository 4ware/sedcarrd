import { expect, test } from "bun:test";
import { render, screen } from "@testing-library/react";
import { HeroActions } from "./hero-actions";

test("renders primary and secondary calls to action", () => {
  render(
    <HeroActions
      primary={{ label: "See what a page can hold", href: "#your-page" }}
      secondary={{ label: "Take a look around", href: "#why" }}
    />,
  );

  expect(screen.getByRole("link", { name: "See what a page can hold" })).toHaveAttribute("href", "#your-page");
  expect(screen.getByRole("link", { name: "Take a look around" })).toHaveAttribute("href", "#why");
});
