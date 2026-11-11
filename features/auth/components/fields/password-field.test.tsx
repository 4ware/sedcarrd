import { describe, expect, test } from "bun:test";
import { screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { renderApp } from "@/test/render-app";
import { PasswordField } from "./password-field";

describe("PasswordField", () => {
  test("is hidden by default and the eye button reveals and hides it again", async () => {
    const user = userEvent.setup();
    renderApp(<PasswordField />);
    const input = screen.getByLabelText("Password");
    await user.type(input, "hunter22");

    expect(input).toHaveAttribute("type", "password");
    const show = screen.getByRole("button", { name: "Show password" });
    expect(show).toHaveAttribute("aria-pressed", "false");
    expect(show).toHaveAttribute("aria-controls", input.id);

    await user.click(show);
    expect(input).toHaveAttribute("type", "text");
    expect(input).toHaveValue("hunter22");
    const hide = screen.getByRole("button", { name: "Hide password" });
    expect(hide).toHaveAttribute("aria-pressed", "true");

    await user.click(hide);
    expect(input).toHaveAttribute("type", "password");
  });

  test("the toggle is a plain button, so it never submits the form", async () => {
    const user = userEvent.setup();
    let submitted = false;
    renderApp(
      <form
        onSubmit={(event) => {
          event.preventDefault();
          submitted = true;
        }}
      >
        <PasswordField />
      </form>,
    );

    await user.click(screen.getByRole("button", { name: "Show password" }));
    expect(submitted).toBe(false);
  });

  test("each field toggles on its own and is translated", async () => {
    const user = userEvent.setup();
    renderApp(
      <>
        <PasswordField variant="new" />
        <PasswordField variant="confirm" />
      </>,
      { locale: "de" },
    );

    const [first] = screen.getAllByRole("button", { name: "Passwort anzeigen" });
    await user.click(first!);

    expect(screen.getByLabelText("Passwort")).toHaveAttribute("type", "text");
    expect(screen.getByLabelText("Passwort wiederholen")).toHaveAttribute("type", "password");
  });

  test("uses the right autocomplete hints per variant", () => {
    renderApp(
      <>
        <PasswordField variant="current" />
      </>,
    );
    expect(screen.getByLabelText("Password")).toHaveAttribute("autocomplete", "current-password");
  });
});
