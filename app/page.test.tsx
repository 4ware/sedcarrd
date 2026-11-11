import { describe, expect, test } from "bun:test";
import { render, screen } from "@testing-library/react";
import Home from "./page";

describe("Home page", () => {
  test("renders the main heading", () => {
    render(<Home />);

    expect(
      screen.getByRole("heading", { level: 1, name: /build next\.js-style apps/i }),
    ).toBeInTheDocument();
  });

  test("links to external resources in a new tab", () => {
    render(<Home />);

    for (const name of ["vinext", "Workers"]) {
      const link = screen.getByRole("link", { name });
      expect(link).toHaveAttribute("target", "_blank");
      expect(link).toHaveAttribute("rel", "noreferrer");
    }
  });

  test("links to the API route", () => {
    render(<Home />);

    expect(screen.getByRole("link", { name: "API route" })).toHaveAttribute("href", "/api/hello");
  });
});
