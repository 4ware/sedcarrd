import { beforeEach, describe, expect, test } from "bun:test";
import { screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { authClientMock, resetAuthClientMock } from "@/test/auth-client-mock";
import { renderApp } from "@/test/render-app";
import { ResetPasswordFlow } from "./reset-password-flow";

async function fill(password: string, confirm = password) {
  const user = userEvent.setup();
  await user.type(screen.getByLabelText("Passwort", { exact: true }), password);
  await user.type(screen.getByLabelText("Passwort wiederholen"), confirm);
  await user.click(screen.getByRole("button", { name: "Passwort speichern" }));
  return user;
}

describe("ResetPasswordFlow", () => {
  beforeEach(() => resetAuthClientMock());

  test("sets the new password with the token, then points to the login", async () => {
    renderApp(<ResetPasswordFlow token="tok-123" />, { locale: "de" });
    await fill("brand new secret");

    expect(await screen.findByRole("heading", { name: "Passwort geändert" })).toBeInTheDocument();
    expect(authClientMock.resetPassword).toHaveBeenCalledWith({ token: "tok-123", newPassword: "brand new secret" });
    expect(screen.getByRole("link", { name: "Zur Anmeldung" })).toHaveAttribute("href", "/login");
  });

  test("checks the repeated password before calling the server", async () => {
    renderApp(<ResetPasswordFlow token="tok-123" />, { locale: "de" });
    await fill("brand new secret", "brand new secrte");

    expect(screen.getByLabelText("Passwort wiederholen")).toHaveAccessibleDescription("Die Passwörter stimmen nicht überein.");
    expect(authClientMock.resetPassword).not.toHaveBeenCalled();
  });

  test("a missing token shows how to get a new link", () => {
    renderApp(<ResetPasswordFlow token={null} />, { locale: "de" });
    expect(screen.getByRole("heading", { name: "Link ungültig" })).toBeInTheDocument();
    expect(screen.getByRole("link", { name: "Neuen Link anfordern" })).toHaveAttribute("href", "/forgot-password");
  });

  test("a token the server rejects (expired or used) shows the same", async () => {
    authClientMock.resetPassword.mockImplementationOnce(async () => ({
      data: null,
      error: { status: 400, code: "INVALID_TOKEN" },
    }));
    renderApp(<ResetPasswordFlow token="used" />, { locale: "de" });
    await fill("brand new secret");

    expect(await screen.findByRole("heading", { name: "Link ungültig" })).toBeInTheDocument();
  });

  test("too short passwords are explained", async () => {
    authClientMock.resetPassword.mockImplementationOnce(async () => ({
      data: null,
      error: { status: 400, code: "PASSWORD_TOO_SHORT" },
    }));
    renderApp(<ResetPasswordFlow token="tok-123" />, { locale: "de" });
    await fill("short1234");

    expect(await screen.findByRole("alert")).toHaveTextContent("Dein Passwort braucht mindestens 8 Zeichen.");
  });
});
