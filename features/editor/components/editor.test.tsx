import { beforeEach, describe, expect, mock, test } from "bun:test";
import { screen, waitFor, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import * as people from "@/features/people";
import { ApiError } from "@/lib/api/unwrap";
import { renderApp } from "@/test/render-app";

type Person = people.PersonInput & { id: string };
type ImageView = { id: string; name: string; url: string };
const lena: Person & { slug: string; theme: people.UpdatePersonInput["theme"] & string; images: ImageView[] } = {
  id: "p-1",
  slug: "lena-vogt",
  theme: "classic",
  images: [
    { id: "img-1", name: "a.jpg", url: "https://storage.example/a.jpg" },
    { id: "img-2", name: "b.jpg", url: "https://storage.example/b.jpg" },
  ],
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
const deleteImage = mock((_imageId: string) => {});
// Keep the real field model; only the data hooks are replaced.
mock.module("@/features/people", () => ({
  ...people,
  usePerson,
  useUpdatePerson: () => ({ mutateAsync, isError: updateFails, reset: () => {} }),
  useRegisterPersonImages: () => ({ mutate: () => {}, error: null }),
  useDeletePersonImage: () => ({ mutate: deleteImage, error: null, isPending: false }),
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
    const { id: _id, slug: _slug, theme: _theme, images: _images, ...expected } = lena;
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

  test("picking a theme saves it right away; Escape and Done keep it", async () => {
    renderApp(<Editor personId="p-1" />);
    const user = userEvent.setup();
    const toolbar = within(screen.getByRole("navigation", { name: "Editor" }));
    expect(themeOf()).toBe("classic");

    await user.click(toolbar.getByRole("button", { name: "Change theme" }));
    let drawer = within(await screen.findByRole("dialog", { name: "Theme" }));
    await waitFor(() => expect(drawer.getByRole("radio", { name: "Classic" })).toHaveFocus());
    await user.click(drawer.getByRole("radio", { name: "Midnight" }));
    expect(themeOf()).toBe("midnight");
    await waitFor(() => expect(mutateAsync).toHaveBeenLastCalledWith({ theme: "midnight" }));

    // Escape only closes: the saved theme stays.
    await user.keyboard("{Escape}");
    await waitFor(() => expect(screen.queryByRole("dialog")).not.toBeInTheDocument());
    expect(themeOf()).toBe("midnight");

    await user.click(toolbar.getByRole("button", { name: "Change theme" }));
    drawer = within(await screen.findByRole("dialog", { name: "Theme" }));
    await user.click(drawer.getByRole("radio", { name: "Sunset" }));
    await waitFor(() => expect(mutateAsync).toHaveBeenLastCalledWith({ theme: "sunset" }));
    await user.click(drawer.getByRole("button", { name: "Done" }));
    await waitFor(() => expect(screen.queryByRole("dialog")).not.toBeInTheDocument());
    expect(themeOf()).toBe("sunset");
    expect(mutateAsync).toHaveBeenCalledTimes(2);
    expect(toolbar.getByRole("button", { name: "Change theme" })).toHaveFocus();
  });

  test("a theme that cannot be saved is reverted", async () => {
    updateFails = true;
    renderApp(<Editor personId="p-1" />);
    const user = userEvent.setup();
    await user.click(within(screen.getByRole("navigation", { name: "Editor" })).getByRole("button", { name: "Change theme" }));
    const drawer = within(await screen.findByRole("dialog", { name: "Theme" }));

    await user.click(drawer.getByRole("radio", { name: "Noir" }));
    await waitFor(() => expect(themeOf()).toBe("classic"));
    expect(drawer.getByRole("radio", { name: "Classic" })).toBeChecked();
    expect(drawer.getByText("Could not save. Please try again.")).toBeInTheDocument();
  });

  test("opens in the person's saved theme", () => {
    personState = { isPending: false, isError: false, data: { ...lena, theme: "mono" }, error: null };
    renderApp(<Editor personId="p-1" />);
    expect(themeOf()).toBe("mono");
  });

  test("shows the photos on the page and manages them in the photos drawer", async () => {
    renderApp(<Editor personId="p-1" />);
    const photos = page().getAllByRole("img");
    expect(photos.map((img) => img.getAttribute("alt"))).toEqual(["Lena Vogt, photo 1", "Lena Vogt, photo 2"]);

    const { user, drawer } = await open("Edit Photos", "Photos");
    expect(drawer.getByText("Drag photos here or click to choose")).toBeInTheDocument();
    expect(drawer.getByText("2 of 24 photos")).toBeInTheDocument();
    const thumbnails = within(drawer.getByRole("list", { name: "Uploaded photos" })).getAllByRole("listitem");
    expect(thumbnails).toHaveLength(2);

    await user.click(drawer.getByRole("button", { name: "Delete photo 2" }));
    expect(deleteImage).toHaveBeenCalledWith("img-2");

    await user.click(drawer.getByRole("button", { name: "Done" }));
    await waitFor(() => expect(screen.queryByRole("dialog")).not.toBeInTheDocument());
    expect(mutateAsync).not.toHaveBeenCalled();
  });

  test("without photos the page shows where to add them", () => {
    personState = { isPending: false, isError: false, data: { ...lena, images: [] }, error: null };
    renderApp(<Editor personId="p-1" />);
    expect(page().getByText("Add photos")).toBeInTheDocument();
  });

  test("the floating menu links to the person's public page and the dashboard", () => {
    renderApp(<Editor personId="p-1" />);
    const toolbar = within(screen.getByRole("navigation", { name: "Editor" }));
    expect(toolbar.getByRole("link", { name: "View public page (new tab)" })).toHaveAttribute("href", "/en/people/lena-vogt");
    expect(toolbar.getByRole("link", { name: "View public page (new tab)" })).toHaveAttribute("target", "_blank");
    expect(toolbar.getByRole("link", { name: "Back to the dashboard" })).toHaveAttribute("href", "/en/dashboard");
  });
});
