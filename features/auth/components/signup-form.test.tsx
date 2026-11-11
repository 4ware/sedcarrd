import { beforeEach, describe, expect, mock, test } from "bun:test";
import { screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { authClientMock, resetAuthClientMock } from "@/test/auth-client-mock";
import { renderApp } from "@/test/render-app";
import { SignupForm } from "./signup-form";

type FillOptions = { name?: string; email?: string; password?: string; confirm?: string };

async function fill({ name = "Mara", email = "mara@example.com", password = "long enough", confirm }: FillOptions = {}) {
  confirm ??= password;
  const user = userEvent.setup();
  await user.type(screen.getByLabelText("Name"), name);
  await user.type(screen.getByLabelText("Email"), email);
  await user.type(screen.getByLabelText("Password"), password);
  await user.type(screen.getByLabelText("Repeat password"), confirm);
  await user.click(screen.getByRole("button", { name: "Create account" }));
  return user;
}

describe("SignupForm", () => {
  const onSignedUp = mock((_email: string) => {});

  beforeEach(() => {
    resetAuthClientMock();
    onSignedUp.mockClear();
  });

  test("creates the account (trimmed) with a localized verification callback", async () => {
    renderApp(<SignupForm onSignedUp={onSignedUp} />);
    await fill({ name: "  Mara Ellison ", email: " mara@example.com ", password: "long enough" });

    await waitFor(() => expect(onSignedUp).toHaveBeenCalledWith("mara@example.com"));
    // The repeated password is only checked in the browser, never sent.
    expect(authClientMock.signUp.email).toHaveBeenCalledWith({
      name: "Mara Ellison",
      email: "mara@example.com",
      password: "long enough",
      callbackURL: expect.stringMatching(/^https?:\/\/[^/]+\/en\/dashboard$/),
    });
  });

  test("German sign-ups get the unprefixed dashboard as callback", async () => {
    renderApp(<SignupForm onSignedUp={onSignedUp} />, { locale: "de" });
    const user = userEvent.setup();
    await user.type(screen.getByLabelText("Name"), "Mara");
    await user.type(screen.getByLabelText("E-Mail"), "mara@example.com");
    await user.type(screen.getByLabelText("Passwort"), "long enough");
    await user.type(screen.getByLabelText("Passwort wiederholen"), "long enough");
    await user.click(screen.getByRole("button", { name: "Konto erstellen" }));

    await waitFor(() => expect(onSignedUp).toHaveBeenCalled());
    expect(authClientMock.signUp.email.mock.calls[0]?.[0].callbackURL).toMatch(/^https?:\/\/[^/]+\/dashboard$/);
  });

  test("blocks mismatching passwords, explains why and focuses the repeat field", async () => {
    renderApp(<SignupForm onSignedUp={onSignedUp} />, { locale: "de" });
    const user = userEvent.setup();
    await user.type(screen.getByLabelText("Name"), "Mara");
    await user.type(screen.getByLabelText("E-Mail"), "mara@example.com");
    await user.type(screen.getByLabelText("Passwort"), "long enough");
    await user.type(screen.getByLabelText("Passwort wiederholen"), "long enuogh");
    await user.click(screen.getByRole("button", { name: "Konto erstellen" }));

    const repeat = screen.getByLabelText("Passwort wiederholen");
    expect(repeat).toHaveAttribute("aria-invalid", "true");
    expect(repeat).toHaveAccessibleDescription("Die Passwörter stimmen nicht überein.");
    expect(repeat).toHaveFocus();
    expect(authClientMock.signUp.email).not.toHaveBeenCalled();

    // Editing clears the message; matching passwords then go through.
    await user.clear(repeat);
    expect(repeat).not.toHaveAttribute("aria-invalid");
    await user.type(repeat, "long enough");
    await user.click(screen.getByRole("button", { name: "Konto erstellen" }));
    await waitFor(() => expect(authClientMock.signUp.email).toHaveBeenCalledTimes(1));
  });

  test("shows server-side validation errors and stays on the form", async () => {
    authClientMock.signUp.email.mockImplementationOnce(async () => ({
      data: null,
      error: { status: 400, code: "INVALID_EMAIL" },
    }));
    renderApp(<SignupForm onSignedUp={onSignedUp} />);
    await fill({ email: "odd@example.com" });

    expect(await screen.findByRole("alert")).toHaveTextContent("Please enter a valid email address.");
    expect(onSignedUp).not.toHaveBeenCalled();
  });

  test("tells new users the password rule", () => {
    renderApp(<SignupForm onSignedUp={onSignedUp} />);
    expect(screen.getByLabelText("Password")).toHaveAccessibleDescription("At least 8 characters.");
  });
});
