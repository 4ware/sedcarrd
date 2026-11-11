import { beforeEach, describe, expect, mock, test } from "bun:test";
import { screen, waitFor, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import * as people from "@/features/people";
import { ApiError } from "@/lib/api/unwrap";
import { renderApp } from "@/test/render-app";

type Person = people.PersonInput & { id: string };
const lena: Person & { theme: "classic" | "mono" | "midnight" | "sunset" } = {
  id: "p-1",
  theme: "classic",
  firstName: "Lena",
  lastName: "Vogt",
  professions: ["Schauspielerin", "Sprecherin"],
  birthYear: 1994,
  birthPlace: "Berlin",
  languages: ["Deutsch", "Englisch"],
  dialects: [],
  singing: [],
  dances: ["Ballett"],
  sports: [],
  licences: [],
  workingLocation: "Berlin",
  primaryResidence: null,
  nationalities: ["Deutsch"],
  heightCm: 170,
  weightKg: null,
  build: "schlank",
  clothingSize: null,
  ethnicAppearance: null,
  hairColor: "braun",
  hairLength: null,
  eyeColor: "grün",
};

type PersonState =
  | { isPending: true; isError: false; data: undefined; error: null }
  | { isPending: false; isError: true; data: undefined; error: Error }
  | { isPending: false; isError: false; data: typeof lena; error: null };

let personState: PersonState = { isPending: false, isError: false, data: lena, error: null };
let updateFails = false;
const mutateAsync = mock(async (_input: people.UpdatePersonInput) => {
  if (updateFails) throw new Error("save failed");
  return {};
});
const usePerson = mock((_id: string) => personState);
// Keep the real field model; only the data hooks are replaced.
mock.module("@/features/people", () => ({
  ...people,
  usePerson,
  useUpdatePerson: () => ({ mutateAsync, isError: updateFails, reset: () => {} }),
}));
const { Editor } = await import("./editor");

const page = (name = "Your page") => within(screen.getByRole("main", { name }));
const themeOf = () => document.querySelector("[data-theme-key]")?.getAttribute("data-theme-key");

async function open(editLabel: string, dialogName: string) {
  const user = userEvent.setup();
  await user.click(page().getByRole("button", { name: editLabel }));
  const drawer = await screen.findByRole("dialog", { name: dialogName });
  return { user, drawer: within(drawer) };
}

describe("Editor", () => {
  beforeEach(() => {
    personState = { isPending: false, isError: false, data: lena, error: null };
    updateFails = false;
    mutateAsync.mockClear();
    usePerson.mockClear();
  });

  test("shows every field of the loaded person on the page", () => {
    renderApp(<Editor personId="p-1" />, { locale: "de" });
    const sitePage = page("Deine Seite");

    expect(usePerson).toHaveBeenCalledWith("p-1");
    expect(sitePage.getByRole("heading", { level: 1 })).toHaveTextContent("Lena Vogt");
    expect(sitePage.getByText("Schauspielerin, Sprecherin")).toBeInTheDocument();
    expect(sitePage.getByText(`Geboren 1994 in Berlin (${new Date().getFullYear() - 1994} Jahre)`)).toBeInTheDocument();
    expect(sitePage.getByRole("heading", { name: "Basisdaten" })).toBeInTheDocument();

    const value = (label: string) => sitePage.getByText(label, { selector: "dt" }).nextElementSibling;
    expect(value("Sprachen")).toHaveTextContent("Deutsch, Englisch");
    expect(value("Fähigkeiten (Tanz)")).toHaveTextContent("Ballett");
    expect(value("Nationalität")).toHaveTextContent("Deutsch");
    expect(value("Körpergröße (cm)")).toHaveTextContent("170 cm");
    expect(value("Augenfarbe")).toHaveTextContent("grün");
    expect(value("Gewicht (kg)")).toHaveTextContent("—");

    for (const section of ["Name", "Über die Person", "Fähigkeiten", "Ort & Nationalität", "Aussehen"]) {
      expect(sitePage.getByRole("button", { name: `${section} bearbeiten` })).toBeInTheDocument();
    }
  });

  test("shows a loading state, then explains a missing person", () => {
    personState = { isPending: true, isError: false, data: undefined, error: null };
    const { rerender } = renderApp(<Editor personId="p-1" />);
    expect(screen.getByRole("status")).toHaveTextContent("Loading the editor…");

    personState = { isPending: false, isError: true, data: undefined, error: new ApiError(404, {}) };
    rerender(<Editor personId="p-1" />);
    expect(screen.getByRole("alert")).toHaveTextContent("This person does not exist (anymore).");
  });

  test("each section opens only its own fields, filled with the loaded data", async () => {
    renderApp(<Editor personId="p-1" />);

    const { user, drawer } = await open("Edit Appearance", "Appearance");
    expect(drawer.getByLabelText("Height (cm)")).toHaveValue("170");
    expect(drawer.getByLabelText("Eye colour")).toHaveValue("grün");
    expect(drawer.queryByLabelText("First name")).not.toBeInTheDocument();
    await waitFor(() => expect(drawer.getByLabelText("Height (cm)")).toHaveFocus());

    await user.keyboard("{Escape}");
    await waitFor(() => expect(screen.queryByRole("dialog")).not.toBeInTheDocument());

    const skills = await open("Edit Skills", "Skills");
    expect(skills.drawer.getByLabelText("Languages")).toHaveValue("Deutsch, Englisch");
    expect(skills.drawer.getByLabelText("Languages")).toHaveAccessibleDescription("Separate several with commas.");
  });

  test("edits show on the page live; Done saves every field with proper types", async () => {
    renderApp(<Editor personId="p-1" />);
    const { user, drawer } = await open("Edit Skills", "Skills");

    const languages = drawer.getByLabelText("Languages");
    await user.clear(languages);
    await user.type(languages, "Deutsch,  Spanisch , ");
    expect(page().getByText("Deutsch, Spanisch")).toBeInTheDocument();

    await user.click(drawer.getByRole("button", { name: "Done" }));
    await waitFor(() => expect(screen.queryByRole("dialog")).not.toBeInTheDocument());

    expect(mutateAsync).toHaveBeenCalledTimes(1);
    const { id: _id, theme: _theme, ...expected } = lena;
    expect(mutateAsync.mock.calls[0]?.[0]).toEqual({ ...expected, languages: ["Deutsch", "Spanisch"] });
    expect(page().getByRole("button", { name: "Edit Skills" })).toHaveFocus();
  });

  test("invalid numbers keep the drawer open", async () => {
    renderApp(<Editor personId="p-1" />, { locale: "de" });
    const user = userEvent.setup();
    await user.click(page("Deine Seite").getByRole("button", { name: "Aussehen bearbeiten" }));
    const drawer = within(await screen.findByRole("dialog", { name: "Aussehen" }));

    await user.clear(drawer.getByLabelText("Körpergröße (cm)"));
    await user.type(drawer.getByLabelText("Körpergröße (cm)"), "17O");
    await user.click(drawer.getByRole("button", { name: "Fertig" }));

    expect(drawer.getByLabelText("Körpergröße (cm)")).toHaveAccessibleDescription(
      "Bitte gib eine Größe zwischen 50 und 250 cm ein.",
    );
    expect(mutateAsync).not.toHaveBeenCalled();
  });

  test("the floating menu opens the name; a failed save keeps the drawer open", async () => {
    updateFails = true;
    renderApp(<Editor personId="p-1" />);
    const user = userEvent.setup();
    await user.click(within(screen.getByRole("navigation", { name: "Editor" })).getByRole("button", { name: "Edit name" }));
    const drawer = within(await screen.findByRole("dialog", { name: "Name" }));
    expect(drawer.getByLabelText("First name")).toHaveValue("Lena");

    await user.click(drawer.getByRole("button", { name: "Done" }));
    await waitFor(() => expect(mutateAsync).toHaveBeenCalled());
    expect(screen.getByRole("dialog", { name: "Name" })).toBeInTheDocument();
    expect(drawer.getByText("Could not save. Please try again.")).toBeInTheDocument();
  });

  test("a required field is flagged once left and clears when fixed", async () => {
    renderApp(<Editor personId="p-1" />);
    const { user, drawer } = await open("Edit Name", "Name");
    const firstName = drawer.getByLabelText("First name");

    await user.clear(firstName);
    await user.tab();
    expect(firstName).toHaveAccessibleDescription("Please enter a first name.");
    await user.type(firstName, "Mara");
    expect(firstName).not.toHaveAttribute("aria-invalid");
    expect(page().getByRole("heading", { level: 1 })).toHaveTextContent("Mara Vogt");
  });

  test("the theme picker previews live, saves with Done and reverts on Escape", async () => {
    renderApp(<Editor personId="p-1" />);
    const user = userEvent.setup();
    const toolbar = within(screen.getByRole("navigation", { name: "Editor" }));
    expect(themeOf()).toBe("classic");

    // Escape discards the preview.
    await user.click(toolbar.getByRole("button", { name: "Change theme" }));
    let drawer = within(await screen.findByRole("dialog", { name: "Theme" }));
    await waitFor(() => expect(drawer.getByRole("radio", { name: "Classic" })).toHaveFocus());
    await user.click(drawer.getByRole("radio", { name: "Midnight" }));
    expect(themeOf()).toBe("midnight");
    await user.keyboard("{Escape}");
    await waitFor(() => expect(screen.queryByRole("dialog")).not.toBeInTheDocument());
    expect(themeOf()).toBe("classic");
    expect(mutateAsync).not.toHaveBeenCalled();

    // Done saves the chosen theme.
    await user.click(toolbar.getByRole("button", { name: "Change theme" }));
    drawer = within(await screen.findByRole("dialog", { name: "Theme" }));
    await user.click(drawer.getByRole("radio", { name: "Sunset" }));
    await user.click(drawer.getByRole("button", { name: "Done" }));
    await waitFor(() => expect(screen.queryByRole("dialog")).not.toBeInTheDocument());
    expect(mutateAsync).toHaveBeenCalledWith({ theme: "sunset" });
    expect(themeOf()).toBe("sunset");
    expect(toolbar.getByRole("button", { name: "Change theme" })).toHaveFocus();
  });

  test("opens in the person's saved theme", () => {
    personState = { isPending: false, isError: false, data: { ...lena, theme: "mono" }, error: null };
    renderApp(<Editor personId="p-1" />);
    expect(themeOf()).toBe("mono");
  });
});
