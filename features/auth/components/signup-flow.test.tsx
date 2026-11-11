import { beforeEach, describe, expect, test } from "bun:test";
import { screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { authClientMock, resetAuthClientMock } from "@/test/auth-client-mock";
import { routerMock } from "@/test/next-navigation-mock";
import { renderApp } from "@/test/render-app";
import { SignupFlow } from "./signup-flow";

async function signUp(email = "mara@example.com") {
  const user = userEvent.setup();
  await user.type(screen.getByLabelText("Name"), "Mara");
  await user.type(screen.getByLabelText("Email"), email);
  await user.type(screen.getByLabelText("Password"), "long enough");
  await user.type(screen.getByLabelText("Repeat password"), "long enough");
  await user.click(screen.getByRole("button", { name: "Create account" }));
  return user;
}

describe("SignupFlow", () => {
  beforeEach(() => {
    resetAuthClientMock();
    routerMock.replace.mockClear();
  });

  test("after sign-up it asks to confirm the email instead of opening the dashboard", async () => {
    renderApp(<SignupFlow />);
    await signUp();

    expect(await screen.findByRole("heading", { name: "Check your inbox" })).toBeVisible();
    expect(screen.getByText(/We sent a confirmation link to/)).toHaveTextContent("mara@example.com");
    expect(screen.queryByRole("form")).not.toBeInTheDocument();
    expect(screen.getByRole("link", { name: "Log in" })).toHaveAttribute("href", "/en/login");
    expect(routerMock.replace).not.toHaveBeenCalled();
  });

  test("sends the link again on request", async () => {
    renderApp(<SignupFlow />);
    const user = await signUp();

    await user.click(await screen.findByRole("button", { name: "Send link again" }));

    expect(await screen.findByRole("status")).toHaveTextContent("A new link is on its way.");
    expect(authClientMock.sendVerificationEmail).toHaveBeenCalledWith({
      email: "mara@example.com",
      callbackURL: expect.stringMatching(/\/en\/dashboard$/),
    });
  });

  test("explains when resending is rate limited", async () => {
    authClientMock.sendVerificationEmail.mockImplementationOnce(async () => ({
      data: null,
      error: { status: 429 },
    }));
    renderApp(<SignupFlow />);
    const user = await signUp();

    await user.click(await screen.findByRole("button", { name: "Send link again" }));

    expect(await screen.findByRole("alert")).toHaveTextContent("Too many attempts.");
  });
});
