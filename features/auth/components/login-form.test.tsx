import { beforeEach, describe, expect, test } from "bun:test";
import { screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { authClientMock, resetAuthClientMock } from "@/test/auth-client-mock";
import { routerMock } from "@/test/next-navigation-mock";
import { renderApp } from "@/test/render-app";
import { LoginForm } from "./login-form";

describe("LoginForm", () => {
  beforeEach(() => {
    resetAuthClientMock();
    routerMock.replace.mockClear();
    routerMock.refresh.mockClear();
  });

  test("signs in and goes to the dashboard", async () => {
    renderApp(<LoginForm />);
    const user = userEvent.setup();
    await user.type(screen.getByLabelText("Email"), "mara@example.com");
    await user.type(screen.getByLabelText("Password"), "correct horse");
    await user.click(screen.getByRole("button", { name: "Log in" }));

    await waitFor(() => expect(routerMock.replace).toHaveBeenCalledWith("/en/dashboard"));
    expect(authClientMock.signIn.email).toHaveBeenCalledWith({
      email: "mara@example.com",
      password: "correct horse",
      callbackURL: "http://localhost:5173/en/dashboard",
    });
    expect(routerMock.refresh).toHaveBeenCalled();
  });

  test("shows a translated error for wrong credentials and stays on the page", async () => {
    authClientMock.signIn.email.mockImplementationOnce(async () => ({
      data: null,
      error: { status: 401, code: "INVALID_EMAIL_OR_PASSWORD" },
    }));
    renderApp(<LoginForm />, { locale: "de" });

    const user = userEvent.setup();
    await user.type(screen.getByLabelText("E-Mail"), "mara@example.com");
    await user.type(screen.getByLabelText("Passwort"), "wrong-password");
    await user.click(screen.getByRole("button", { name: "Anmelden" }));

    expect(await screen.findByRole("alert")).toHaveTextContent("E-Mail oder Passwort ist falsch.");
    expect(routerMock.replace).not.toHaveBeenCalled();
  });

  test("asks unverified users to confirm their email first", async () => {
    authClientMock.signIn.email.mockImplementationOnce(async () => ({
      data: null,
      error: { status: 403, code: "EMAIL_NOT_VERIFIED" },
    }));
    renderApp(<LoginForm />);

    const user = userEvent.setup();
    await user.type(screen.getByLabelText("Email"), "new@example.com");
    await user.type(screen.getByLabelText("Password"), "correct horse");
    await user.click(screen.getByRole("button", { name: "Log in" }));

    expect(await screen.findByRole("alert")).toHaveTextContent(
      "Please confirm your email address first. We've just sent you a new link.",
    );
    expect(routerMock.replace).not.toHaveBeenCalled();
  });

  test("links to the forgot-password page", () => {
    renderApp(<LoginForm />, { locale: "de" });
    expect(screen.getByRole("link", { name: "Passwort vergessen?" })).toHaveAttribute("href", "/forgot-password");
  });
});
