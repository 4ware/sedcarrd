import { expect, test } from "bun:test";
import { screen } from "@testing-library/react";
import { renderWithIntl } from "@/test/render-with-intl";
import { HeroShowcase } from "./hero-showcase";

test("renders the card with its surrounding notes", () => {
  renderWithIntl(<HeroShowcase />);

  expect(screen.getByRole("article")).toHaveTextContent("Mara Ellison");
  expect(screen.getByText("A page that feels like you.")).toBeInTheDocument();
  expect(screen.getByText("starts here")).toBeInTheDocument();
  expect(screen.getByText("sedcarrd.com/mara-ellison")).toBeInTheDocument();
});
