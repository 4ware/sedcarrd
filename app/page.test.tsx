import { expect, test } from "bun:test";
import { render, screen } from "@testing-library/react";
import Home from "./page";

test("home route renders the landing page", () => {
  render(<Home />);

  expect(screen.getByRole("banner")).toBeInTheDocument();
  expect(screen.getByRole("heading", { level: 1 })).toHaveTextContent(/good frame\./);
});
