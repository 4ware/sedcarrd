import { beforeEach, describe, expect, test } from "bun:test";
import { screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { authClientMock, resetAuthClientMock } from "@/test/auth-client-mock";
import { routerMock } from "@/test/next-navigation-mock";
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
  beforeEach(() => {
    resetAuthClientMock();
    routerMock.replace.mockClear();
  });

  test("creates the account (trimmed) and goes to the dashboard", async () => {
    renderApp(<SignupForm />);
    await fill({ name: "  Mara Ellison ", password: "long enough" });

    await waitFor(() => expect(routerMock.replace).toHaveBeenCalledWith("/en/dashboard"));
    // The repeated password is only checked in the browser, never sent.
    expect(authClientMock.signUp.email).toHaveBeenCalledWith({
      name: "Mara Ellison",
      email: "mara@example.com",
      password: "long enough",
    });
  });

  test("blocks mismatching passwords, explains why and focuses the repeat field", async () => {
    renderApp(<SignupForm />, { locale: "de" });
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

  test("explains a taken email", async () => {
    authClientMock.signUp.email.mockImplementationOnce(async () => ({
      data: null,
      error: { status: 422, code: "USER_ALREADY_EXISTS_USE_ANOTHER_EMAIL" },
    }));
    renderApp(<SignupForm />);
    await fill({ email: "taken@example.com" });

    expect(await screen.findByRole("alert")).toHaveTextContent("There is already an account for this email.");
    expect(routerMock.replace).not.toHaveBeenCalled();
  });

  test("tells new users the password rule", () => {
    renderApp(<SignupForm />);
    expect(screen.getByLabelText("Password")).toHaveAccessibleDescription("At least 8 characters.");
  });
});
