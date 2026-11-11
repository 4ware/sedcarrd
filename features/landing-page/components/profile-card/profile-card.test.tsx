import { describe, expect, test } from "bun:test";
import { render, screen } from "@testing-library/react";
import { sampleProfile } from "../../lib/content";
import { ProfileCard } from "./profile-card";

describe("ProfileCard", () => {
  test("shows name, meta, quote and links", () => {
    render(<ProfileCard profile={sampleProfile} />);

    expect(screen.getByRole("heading", { name: "Mara Ellison" })).toBeInTheDocument();
    expect(screen.getByText("Actor · London / New York")).toBeInTheDocument();
    expect(screen.getByText(/Drawn to stories/)).toBeInTheDocument();
    for (const link of sampleProfile.links) expect(screen.getByText(link)).toBeInTheDocument();
    expect(screen.getByRole("link", { name: "Open Mara Ellison's page" })).toHaveAttribute("href", "/mara-ellison");
  });

  test("falls back to a placeholder without a photo", () => {
    render(<ProfileCard profile={{ ...sampleProfile, photo: undefined }} />);
    expect(screen.getByTestId("profile-photo-placeholder")).toBeInTheDocument();
    expect(screen.queryByRole("img")).not.toBeInTheDocument();
  });

  test("renders the photo when provided", () => {
    render(<ProfileCard profile={{ ...sampleProfile, photo: { src: "/mara.jpg", alt: "Mara Ellison" } }} />);
    expect(screen.getByRole("img", { name: "Mara Ellison" })).toHaveAttribute("src", "/mara.jpg");
  });
});
