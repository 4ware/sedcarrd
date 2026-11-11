import { beforeEach, describe, expect, mock, test } from "bun:test";
import { screen, within } from "@testing-library/react";
import { renderApp } from "@/test/render-app";

type Summary = {
  id: string;
  firstName: string;
  lastName: string;
  professions: string[];
  birthYear: number | null;
  workingLocation: string | null;
  thumbnailUrl: string | null;
};
type QueryState =
  | { isPending: true; isError: false; data: undefined }
  | { isPending: false; isError: true; data: undefined }
  | { isPending: false; isError: false; data: Summary[] };

let state: QueryState = { isPending: true, isError: false, data: undefined };
mock.module("../api/use-people", () => ({ usePeople: () => state }));
const { PeopleList } = await import("./people-list");

describe("PeopleList", () => {
  beforeEach(() => {
    state = { isPending: true, isError: false, data: undefined };
  });

  test("shows placeholders while loading", () => {
    renderApp(<PeopleList />);
    expect(screen.getByRole("status")).toHaveTextContent("Loading people");
  });

  test("explains the empty state", () => {
    state = { isPending: false, isError: false, data: [] };
    renderApp(<PeopleList />, { locale: "de" });
    expect(screen.getByRole("heading", { name: "Deine Personen" })).toBeInTheDocument();
    expect(screen.getByText("Noch keine Personen")).toBeInTheDocument();
    expect(screen.getByRole("link", { name: "Person anlegen" })).toHaveAttribute("href", "/dashboard/people/new");
  });

  test("lists each person with professions, age and working location", () => {
    state = {
      isPending: false,
      isError: false,
      data: [
        {
          id: "1",
          firstName: "Paula",
          lastName: "Zeller",
          professions: ["Schauspielerin", "Sängerin"],
          birthYear: new Date().getFullYear() - 26,
          workingLocation: "Madrid",
          thumbnailUrl: "https://storage.example/paula.jpg",
        },
        { id: "2", firstName: "Anna", lastName: "Albers", professions: [], birthYear: null, workingLocation: null, thumbnailUrl: null },
      ],
    };
    renderApp(<PeopleList />);

    const items = within(screen.getByRole("list")).getAllByRole("listitem");
    expect(items).toHaveLength(2);
    expect(items[0]).toHaveTextContent("Paula Zeller");
    expect(within(items[0] as HTMLElement).getByRole("link", { name: "Paula Zeller" })).toHaveAttribute(
      "href",
      "/en/dashboard/editor/1",
    );
    expect(items[0]).toHaveTextContent("Schauspielerin, Sängerin");
    expect(items[0]).toHaveTextContent("26 years · Madrid");
    // First photo as thumbnail, initials without photos.
    expect(items[0]?.querySelector("img")).toHaveAttribute("src", "https://storage.example/paula.jpg");
    expect(items[0]?.querySelector("img")).toHaveAttribute("alt", "");
    expect(items[1]?.querySelector("img")).toBeNull();
    expect(within(items[1] as HTMLElement).getByTestId("person-initials")).toHaveTextContent("AA");
    expect(within(items[1] as HTMLElement).getByRole("link")).toHaveAccessibleName("Anna Albers");
    // Each person is a heading inside the "Your people" section.
    expect(screen.getAllByRole("heading", { level: 3 }).map((h) => h.textContent)).toEqual(["Paula Zeller", "Anna Albers"]);
  });

  test("reports a failed request", () => {
    state = { isPending: false, isError: true, data: undefined };
    renderApp(<PeopleList />);
    expect(screen.getByRole("alert")).toHaveTextContent("Your people could not be loaded.");
  });
});
