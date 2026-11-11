import { beforeEach, describe, expect, test } from "bun:test";
import { screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { authClientMock, resetAuthClientMock } from "@/test/auth-client-mock";
import { renderApp } from "@/test/render-app";
import { ForgotPasswordFlow } from "./forgot-password-flow";

describe("ForgotPasswordFlow", () => {
  beforeEach(() => resetAuthClientMock());

  test("requests a reset link pointing at the localized reset page, then says it is on its way", async () => {
    renderApp(<ForgotPasswordFlow />, { locale: "de" });
    const user = userEvent.setup();

    await user.type(screen.getByLabelText("E-Mail"), " mara@example.com ");
    await user.click(screen.getByRole("button", { name: "Link zum Zurücksetzen senden" }));

    expect(await screen.findByRole("heading", { name: "Schau in dein Postfach" })).toBeInTheDocument();
    expect(screen.getByRole("status")).toHaveTextContent("Wenn es ein Konto für mara@example.com gibt");
    expect(authClientMock.requestPasswordReset).toHaveBeenCalledWith({
      email: "mara@example.com",
      redirectTo: "http://localhost:5173/reset-password",
    });

    // Another address: back to the form.
    await user.click(screen.getByRole("button", { name: "Andere E-Mail-Adresse verwenden" }));
    expect(screen.getByRole("form", { name: "Passwort vergessen?" })).toBeInTheDocument();
  });

  test("English pages get the English reset page (and email)", async () => {
    renderApp(<ForgotPasswordFlow />);
    const user = userEvent.setup();
    await user.type(screen.getByLabelText("Email"), "mara@example.com");
    await user.click(screen.getByRole("button", { name: "Send reset link" }));

    await screen.findByRole("heading", { name: "Check your inbox" });
    expect(authClientMock.requestPasswordReset.mock.calls[0]?.[0].redirectTo).toBe("http://localhost:5173/en/reset-password");
  });

  test("explains rate limiting", async () => {
    authClientMock.requestPasswordReset.mockImplementationOnce(async () => ({ data: null, error: { status: 429 } }));
    renderApp(<ForgotPasswordFlow />);
    const user = userEvent.setup();
    await user.type(screen.getByLabelText("Email"), "mara@example.com");
    await user.click(screen.getByRole("button", { name: "Send reset link" }));

    expect(await screen.findByRole("alert")).toHaveTextContent("Too many attempts.");
  });
});
