import { describe, expect, test } from "bun:test";
import { screen } from "@testing-library/react";
import { renderWithIntl } from "@/test/render-with-intl";
import { sampleProfile } from "../../lib/content";
import { ProfileCard } from "./profile-card";

describe("ProfileCard", () => {
  test("shows name, meta, quote and links", () => {
    renderWithIntl(<ProfileCard profile={sampleProfile} />);

    expect(screen.getByRole("heading", { name: "Mara Ellison" })).toBeInTheDocument();
    expect(screen.getByText("Actor · London / New York")).toBeInTheDocument();
    expect(screen.getByText(/Drawn to stories/)).toBeInTheDocument();
    for (const link of ["Reel", "Credits", "Contact"]) expect(screen.getByText(link)).toBeInTheDocument();
    expect(screen.getByRole("link", { name: "Open Mara Ellison's page" })).toHaveAttribute("href", "/mara-ellison");
  });

  test("translates copy to German", () => {
    renderWithIntl(<ProfileCard profile={sampleProfile} />, { locale: "de" });

    expect(screen.getByText("Schauspielerin · London / New York")).toBeInTheDocument();
    expect(screen.getByRole("link", { name: "Seite von Mara Ellison öffnen" })).toBeInTheDocument();
  });

  test("falls back to a placeholder without a photo", () => {
    renderWithIntl(<ProfileCard profile={{ ...sampleProfile, photo: undefined }} />);
    expect(screen.getByTestId("profile-photo-placeholder")).toBeInTheDocument();
    expect(screen.queryByRole("img")).not.toBeInTheDocument();
  });

  test("renders the photo when provided", () => {
    renderWithIntl(<ProfileCard profile={{ ...sampleProfile, photo: { src: "/mara.jpg", alt: "Mara Ellison" } }} />);
    expect(screen.getByRole("img", { name: "Mara Ellison" })).toHaveAttribute("src", "/mara.jpg");
  });
});
