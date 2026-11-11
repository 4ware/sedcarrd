import { describe, expect, test } from "bun:test";
import { screen } from "@testing-library/react";
import { renderWithIntl } from "@/test/render-with-intl";
import { LandingPage } from "./landing-page";

describe("LandingPage", () => {
  test("renders in German", () => {
    renderWithIntl(<LandingPage />, { locale: "de" });

    expect(screen.getByRole("heading", { level: 1 })).toHaveTextContent("guten Rahmen.");
    expect(screen.getByRole("link", { name: "Schaffe Raum für deine Arbeit" })).toBeInTheDocument();
  });

  test("renders in English", () => {
    renderWithIntl(<LandingPage />, { locale: "en" });

    expect(screen.getByRole("heading", { level: 1 })).toHaveTextContent("good frame.");
    expect(screen.getByRole("link", { name: "Make room for your work" })).toBeInTheDocument();
  });
});
