import { beforeEach, describe, expect, mock, test } from "bun:test";
import { screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { routerMock } from "@/test/next-navigation-mock";
import { renderApp } from "@/test/render-app";
import type { CreatePersonInput } from "../lib/person-form";

const mutateAsync = mock(async (_input: CreatePersonInput) => ({}));
let isError = false;
mock.module("../api/use-create-person", () => ({ useCreatePerson: () => ({ mutateAsync, isError }) }));
const { CreatePersonForm } = await import("./create-person-form");

describe("CreatePersonForm", () => {
  beforeEach(() => {
    mutateAsync.mockReset();
    mutateAsync.mockImplementation(async () => ({}));
    routerMock.push.mockClear();
    isError = false;
  });

  test("saves the person and goes back to the dashboard", async () => {
    renderApp(<CreatePersonForm />, { locale: "de" });
    const user = userEvent.setup();

    await user.type(screen.getByLabelText("Vorname"), "Lena");
    await user.type(screen.getByLabelText("Nachname"), "Vogt");
    await user.type(screen.getByLabelText("Berufe"), "Schauspielerin, Sprecherin");
    await user.type(screen.getByLabelText("Geburtsjahr"), "1994");
    await user.type(screen.getByLabelText("Unmittelbarer Arbeitsort"), "Berlin");
    await user.click(screen.getByRole("button", { name: "Person speichern" }));

    await waitFor(() => expect(routerMock.push).toHaveBeenCalledWith("/dashboard"));
    expect(mutateAsync).toHaveBeenCalledWith({
      firstName: "Lena",
      lastName: "Vogt",
      professions: ["Schauspielerin", "Sprecherin"],
      birthYear: 1994,
      birthPlace: null,
      workingLocation: "Berlin",
    });
  });

  test("shows validation errors and does not save", async () => {
    renderApp(<CreatePersonForm />);
    const user = userEvent.setup();

    await user.type(screen.getByLabelText("Year of birth"), "94");
    await user.click(screen.getByRole("button", { name: "Save person" }));

    expect(await screen.findByText("Please enter a first name.")).toBeInTheDocument();
    expect(screen.getByLabelText("Last name")).toHaveAccessibleDescription("Please enter a last name.");
    expect(screen.getByLabelText("Year of birth")).toHaveAccessibleDescription(
      "Please enter a four-digit year, e.g. 1994.",
    );
    expect(mutateAsync).not.toHaveBeenCalled();
  });

  test("stays on the page when saving fails", async () => {
    mutateAsync.mockImplementation(async () => {
      throw new Error("boom");
    });
    renderApp(<CreatePersonForm />);
    const user = userEvent.setup();

    await user.type(screen.getByLabelText("First name"), "Lena");
    await user.type(screen.getByLabelText("Last name"), "Vogt");
    await user.click(screen.getByRole("button", { name: "Save person" }));

    await waitFor(() => expect(mutateAsync).toHaveBeenCalled());
    expect(routerMock.push).not.toHaveBeenCalled();
  });

  test("links back to the dashboard", () => {
    renderApp(<CreatePersonForm />);
    expect(screen.getByRole("link", { name: "Cancel" })).toHaveAttribute("href", "/en/dashboard");
  });
});
