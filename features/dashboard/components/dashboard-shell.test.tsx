import { expect, test } from "bun:test";
import { screen } from "@testing-library/react";
import { renderApp } from "@/test/render-app";
import { DashboardShell } from "./dashboard-shell";

test("renders the sidebar (brand, navigation, user menu) around the page", () => {
  renderApp(
    <DashboardShell user={{ name: "Mara Ellison", email: "mara@example.com" }}>
      <p>page content</p>
    </DashboardShell>,
  );

  expect(screen.getByRole("link", { name: "Dashboard home" })).toBeInTheDocument();
  expect(screen.getByRole("link", { name: "Overview" })).toHaveAttribute("href", "/en/dashboard");
  expect(screen.getByRole("button", { name: "Account menu" })).toHaveTextContent("Mara Ellison");
  expect(screen.getByText("page content")).toBeInTheDocument();
});
