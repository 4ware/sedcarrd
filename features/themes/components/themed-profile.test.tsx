import { describe, expect, test } from "bun:test";
import { render, screen, within } from "@testing-library/react";
import type { ReactNode } from "react";
import type { ProfileSectionKey, ProfileView } from "../lib/types";
import { THEME_KEYS } from "../registry";
import { ThemedProfile } from "./themed-profile";

const profile: ProfileView = {
  name: "Lena Vogt",
  professions: ["Schauspielerin", "Sprecherin"],
  born: "Geboren 1994 in Berlin (32 Jahre)",
  basicsTitle: "Basisdaten",
  photosTitle: "Fotos",
  emptyValue: "—",
  images: [
    { id: "i1", url: "https://example.com/1.jpg", alt: "Lena Vogt, Foto 1" },
    { id: "i2", url: "https://example.com/2.jpg", alt: "Lena Vogt, Foto 2" },
  ],
  placeholders: { name: "Dein Name", about: "Berufe, Geburtsjahr und -ort", photos: "Fotos hinzufügen" },
  groups: [
    { key: "skills", title: "Fähigkeiten", rows: [{ label: "Sprachen", value: "Deutsch, Englisch" }] },
    { key: "location", title: "Ort & Nationalität", rows: [{ label: "Nationalität", value: "" }] },
    { key: "appearance", title: "Aussehen", rows: [{ label: "Augenfarbe", value: "grün" }] },
  ],
};

/** A plain Section slot that marks each block, like a public page would (minus the marker). */
function MarkedSection({ section, children }: { section: ProfileSectionKey; className?: string; children: ReactNode }) {
  return <div data-testid={`section-${section}`}>{children}</div>;
}

describe.each(THEME_KEYS)("%s theme", (theme) => {
  test("renders every block through the Section slot", () => {
    const { container } = render(<ThemedProfile theme={theme} profile={profile} Section={MarkedSection} />);

    expect(container.querySelector(`[data-theme-key="${theme}"]`)).not.toBeNull();
    expect(within(screen.getByTestId("section-name")).getByRole("heading", { level: 1 })).toHaveTextContent("Lena Vogt");
    expect(screen.getByTestId("section-about")).toHaveTextContent("Schauspielerin");
    expect(screen.getByTestId("section-about")).toHaveTextContent("Geboren 1994 in Berlin (32 Jahre)");
    expect(screen.getByTestId("section-skills")).toHaveTextContent("Deutsch, Englisch");
    expect(screen.getByTestId("section-location")).toHaveTextContent("—");
    expect(screen.getByTestId("section-appearance")).toHaveTextContent("grün");
    expect(screen.getByText("Basisdaten")).toBeInTheDocument();
    const photos = within(screen.getByTestId("section-photos")).getAllByRole("img");
    expect(photos.map((img) => img.getAttribute("alt"))).toEqual(["Lena Vogt, Foto 1", "Lena Vogt, Foto 2"]);
    expect(photos[0]).toHaveAttribute("src", "https://example.com/1.jpg");
  });

  test("has a proper heading outline: name, then photos and Basisdaten, then the groups", () => {
    render(<ThemedProfile theme={theme} profile={profile} Section={MarkedSection} />);
    expect(screen.getAllByRole("heading", { level: 1 }).map((h) => h.textContent)).toEqual(["Lena Vogt"]);
    expect(screen.getAllByRole("heading", { level: 2 }).map((h) => h.textContent)).toEqual(["Fotos", "Basisdaten"]);
    // Accessible names: decoration such as Mono's "01 /" is not read out.
    const groups = screen.getAllByRole("heading", { level: 3 });
    expect(groups).toHaveLength(3);
    ["Fähigkeiten", "Ort & Nationalität", "Aussehen"].forEach((name, i) => expect(groups[i]).toHaveAccessibleName(name));
  });

  test("a single photo is shown large, none shows the placeholder", () => {
    const { rerender } = render(
      <ThemedProfile theme={theme} profile={{ ...profile, images: profile.images.slice(0, 1) }} Section={MarkedSection} />,
    );
    expect(within(screen.getByTestId("section-photos")).getAllByRole("img")).toHaveLength(1);

    rerender(<ThemedProfile theme={theme} profile={{ ...profile, images: [] }} Section={MarkedSection} />);
    expect(screen.getByTestId("section-photos")).toHaveTextContent("Fotos hinzufügen");
  });

  test("shows placeholders for an empty profile", () => {
    render(
      <ThemedProfile
        theme={theme}
        profile={{ ...profile, name: "", professions: [], born: "" }}
        Section={MarkedSection}
      />,
    );
    expect(screen.getByRole("heading", { level: 1 })).toHaveTextContent("Dein Name");
    expect(screen.getByTestId("section-about")).toHaveTextContent("Berufe, Geburtsjahr und -ort");
  });
});
