import { beforeEach, describe, expect, test } from "bun:test";
import { screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { authClientMock, resetAuthClientMock } from "@/test/auth-client-mock";
import { routerMock } from "@/test/next-navigation-mock";
import { renderApp } from "@/test/render-app";
import { SignupForm } from "./signup-form";

async function fill(name: string, email: string, password: string) {
  const user = userEvent.setup();
  await user.type(screen.getByLabelText("Name"), name);
  await user.type(screen.getByLabelText("Email"), email);
  await user.type(screen.getByLabelText("Password"), password);
  await user.click(screen.getByRole("button", { name: "Create account" }));
}

describe("SignupForm", () => {
  beforeEach(() => {
    resetAuthClientMock();
    routerMock.replace.mockClear();
  });

  test("creates the account (trimmed) and goes to the dashboard", async () => {
    renderApp(<SignupForm />);
    await fill("  Mara Ellison ", "mara@example.com", "long enough");

    await waitFor(() => expect(routerMock.replace).toHaveBeenCalledWith("/en/dashboard"));
    expect(authClientMock.signUp.email).toHaveBeenCalledWith({
      name: "Mara Ellison",
      email: "mara@example.com",
      password: "long enough",
    });
  });

  test("explains a taken email", async () => {
    authClientMock.signUp.email.mockImplementationOnce(async () => ({
      data: null,
      error: { status: 422, code: "USER_ALREADY_EXISTS_USE_ANOTHER_EMAIL" },
    }));
    renderApp(<SignupForm />);
    await fill("Mara", "taken@example.com", "long enough");

    expect(await screen.findByRole("alert")).toHaveTextContent("There is already an account for this email.");
    expect(routerMock.replace).not.toHaveBeenCalled();
  });

  test("tells new users the password rule", () => {
    renderApp(<SignupForm />);
    expect(screen.getByLabelText("Password")).toHaveAccessibleDescription("At least 8 characters.");
  });
});
