import { expect, test } from "bun:test";
import { render, screen } from "@testing-library/react";
import { AvatarStack } from "./avatar-stack";

test("renders one avatar per person with its colour", () => {
  render(
    <AvatarStack
      people={[
        { initials: "ME", color: "rgb(1, 2, 3)" },
        { initials: "JL", color: "rgb(4, 5, 6)" },
      ]}
    />,
  );

  expect(screen.getByText("ME")).toHaveStyle({ backgroundColor: "rgb(1, 2, 3)" });
  expect(screen.getByText("JL")).toHaveStyle({ backgroundColor: "rgb(4, 5, 6)" });
});
