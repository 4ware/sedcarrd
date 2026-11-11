import { beforeEach, describe, expect, test } from "bun:test";
import { screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { SidebarProvider } from "@/components/ui/sidebar";
import { authClientMock, resetAuthClientMock } from "@/test/auth-client-mock";
import { routerMock } from "@/test/next-navigation-mock";
import { renderApp } from "@/test/render-app";

import { NavUser } from "./nav-user";

function renderNavUser(locale: "de" | "en" = "en") {
  return renderApp(
    <SidebarProvider>
      <NavUser name="Mara Ellison" email="mara@example.com" />
    </SidebarProvider>,
    { locale },
  );
}

describe("NavUser", () => {
  beforeEach(() => {
    resetAuthClientMock();
    routerMock.replace.mockClear();
  });

  test("shows who is signed in", () => {
    renderNavUser();
    const trigger = screen.getByRole("button", { name: "Account menu" });
    expect(trigger).toHaveTextContent("Mara Ellison");
    expect(trigger).toHaveTextContent("mara@example.com");
    expect(trigger).toHaveTextContent("ME");
  });

  test("offers only a logout entry, which signs out and goes to the login page", async () => {
    const user = userEvent.setup();
    renderNavUser("de");

    await user.click(screen.getByRole("button", { name: "Kontomenü" }));
    const items = screen.getAllByRole("menuitem");
    expect(items).toHaveLength(1);
    expect(items[0]).toHaveTextContent("Abmelden");

    await user.click(items[0]!);
    await waitFor(() => expect(routerMock.replace).toHaveBeenCalledWith("/login"));
    expect(authClientMock.signOut).toHaveBeenCalledTimes(1);
  });
});
