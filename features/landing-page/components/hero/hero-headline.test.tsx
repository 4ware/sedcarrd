import { expect, test } from "bun:test";
import { render, screen } from "@testing-library/react";
import { HeroHeadline } from "./hero-headline";

test("renders every line plus the emphasised accent", () => {
  render(<HeroHeadline lines={["Your work", "deserves a"]} accent="good frame." />);

  const heading = screen.getByRole("heading", { level: 1 });
  expect(heading).toHaveTextContent("Your workdeserves agood frame.");
  expect(screen.getByText("good frame.").tagName).toBe("EM");
});
