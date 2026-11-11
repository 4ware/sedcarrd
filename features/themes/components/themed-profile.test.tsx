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
  emptyValue: "—",
  placeholders: { name: "Dein Name", about: "Berufe, Geburtsjahr und -ort" },
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
