import { describe, expect, test } from "bun:test";
import { screen } from "@testing-library/react";
import { renderApp } from "@/test/render-app";
import { PublicProfileView } from "./public-profile";

const empty = {
  professions: [],
  birthYear: null,
  birthPlace: null,
  languages: [],
  dialects: [],
  singing: [],
  dances: [],
  sports: [],
  licences: [],
  workingLocation: null,
  primaryResidence: null,
  nationalities: [],
  heightCm: null,
  weightKg: null,
  build: null,
  clothingSize: null,
  ethnicAppearance: null,
  hairColor: null,
  hairLength: null,
  eyeColor: null,
};

describe("PublicProfileView", () => {
  test("renders the person in their theme", () => {
    const { container } = renderApp(
      <PublicProfileView
        person={{
          ...empty,
          firstName: "Lena",
          lastName: "Vogt",
          professions: ["Schauspielerin"],
          birthYear: 1994,
          birthPlace: "Berlin",
          languages: ["Deutsch", "Englisch"],
          heightCm: 170,
          theme: "noir",
          images: [{ id: "i1", name: "a.jpg", url: "https://storage.example/a.jpg" }],
        }}
      />,
      { locale: "de" },
    );

    expect(container.querySelector('[data-theme-key="noir"]')).not.toBeNull();
    expect(screen.getByRole("heading", { level: 1 })).toHaveTextContent("Lena Vogt");
    expect(screen.getByText(/Geboren 1994 in Berlin/)).toBeInTheDocument();
    expect(screen.getByRole("img", { name: "Lena Vogt, Foto 1" })).toHaveAttribute("src", "https://storage.example/a.jpg");
    expect(screen.getByText("Deutsch, Englisch")).toBeInTheDocument();
    expect(screen.getByText("170 cm")).toBeInTheDocument();
    // Public: nothing is editable.
    expect(screen.queryByRole("button")).not.toBeInTheDocument();
  });

  test("leaves out empty sections instead of showing editor placeholders", () => {
    renderApp(<PublicProfileView person={{ ...empty, firstName: "Jonas", lastName: "Adler", theme: "classic", images: [] }} />, {
      locale: "de",
    });

    expect(screen.getByRole("heading", { level: 1 })).toHaveTextContent("Jonas Adler");
    expect(screen.queryByText("Fotos hinzufügen")).not.toBeInTheDocument();
    expect(screen.queryByText("Berufe, Geburtsjahr und -ort")).not.toBeInTheDocument();
    for (const group of ["Fähigkeiten", "Ort & Nationalität", "Aussehen"]) {
      expect(screen.queryByRole("heading", { name: group })).not.toBeInTheDocument();
    }
  });
});
